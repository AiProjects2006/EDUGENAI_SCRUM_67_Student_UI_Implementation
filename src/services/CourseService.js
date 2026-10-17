const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8087';
const COURSE_SERVICE_URL = import.meta.env.VITE_COURSE_SERVICE_URL || 'http://localhost:8082';
const BACKOFFICE_URL = import.meta.env.VITE_BACKOFFICE_URL || 'http://localhost:8086';
const RESOURCE_SERVICE_URL = import.meta.env.VITE_RESOURCE_SERVICE_URL || 'http://localhost:8085';

const request = async (path, options = {}) => {
  const method = (options.method || "GET").toUpperCase();

  const isPublicRead =
    method === "GET" &&
    ["/courses", "/subjects", "/modules"].includes(path);

  const token = localStorage.getItem("access_token");

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(!isPublicRead && token
      ? { Authorization: `Bearer ${token}` }
      : {}),
    ...(options.headers || {})
  };

  const response = await fetch(
    `${GATEWAY_URL}/api/v1${path}`,
    {
      ...options,
      method,
      headers,
      cache: "no-store"
    }
  );

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      `${method} ${path} failed: HTTP ${response.status} ${message}`
    );
  }

  const body = await response.json();

  return body?.data !== undefined ? body.data : body;
};

const SUBJECT_ICONS = {
  math: 'twemoji:input-numbers',
  science: 'twemoji:tropical-fish',
  ict: 'twemoji:laptop',
  english: 'twemoji:open-book',
  program: 'twemoji:laptop',
  network: 'twemoji:antenna-bars',
  database: 'twemoji:card-file-box'
};

const iconForSubject = (name = '') => {
  const lower = String(name || '').toLowerCase();
  const key = Object.keys(SUBJECT_ICONS).find((k) => lower.includes(k));
  return SUBJECT_ICONS[key] || 'twemoji:books';
};

const MODULE_ICONS = [
  'twemoji:blue-book',
  'twemoji:green-book',
  'twemoji:orange-book',
  'twemoji:closed-book',
  'twemoji:ledger'
];

/**
 * Deduplicate courses by normalized title and ID so no course appears more than once.
 */
export const deduplicateCourses = (courses = []) => {
  if (!Array.isArray(courses)) return [];
  const seenTitles = new Set();
  const seenIds = new Set();
  const result = [];

  for (const c of courses) {
    if (!c) continue;
    const titleKey = (c.title || c.name || '').trim().toLowerCase();
    const idKey = String(c.courseId || c.id || '');

    if (titleKey && seenTitles.has(titleKey)) continue;
    if (idKey && seenIds.has(idKey)) continue;

    if (titleKey) seenTitles.add(titleKey);
    if (idKey) seenIds.add(idKey);

    result.push(c);
  }

  return result;
};

export const fetchPublishedCourses = async () => {
  let rawCourses = [];
  let subjects = [];

  // Attempt to fetch subjects for name resolution (never let failure block courses)
  try {
    subjects = await request('/subjects');
  } catch (_) {
    try {
      const res = await fetch(`${COURSE_SERVICE_URL}/api/v1/subjects`);
      if (res.ok) {
        const body = await res.json();
        subjects = body.data || [];
      }
    } catch (_) {}
  }

  const subjectMap = {};
  if (Array.isArray(subjects)) {
    subjects.forEach((s) => {
      if (s && s.subjectId) {
        subjectMap[s.subjectId] = s.name;
      }
    });
  }

  // 1. Primary: fetch courses from Course Service (via Gateway or direct)
  try {
    const data = await request('/courses');
    if (Array.isArray(data) && data.length > 0) {
      rawCourses = data;
    }
  } catch (err) {
    console.warn('Could not fetch courses from Course Service:', err.message);
  }

  // 2. Secondary fallback / supplement: Backoffice API
  try {
    const backofficeUrl = `${GATEWAY_URL}/api/v1/backoffice/courses`;
    const res = await fetch(backofficeUrl).catch(() =>
      fetch(`${BACKOFFICE_URL}/api/v1/backoffice/courses`)
    );
    if (res && res.ok) {
      const json = await res.json();
      const bList = json.data || json;
      if (Array.isArray(bList) && bList.length > 0) {
        if (!rawCourses || rawCourses.length === 0) {
          rawCourses = bList;
        } else {
          rawCourses = [...rawCourses, ...bList];
        }
      }
    }
  } catch (_) {}

  // 3. Supplement from localStorage (instant update when creator publishes in browser)
  try {
    const local = JSON.parse(
      localStorage.getItem('courses') || localStorage.getItem('admin_courses') || '[]'
    );
    if (Array.isArray(local) && local.length > 0) {
      rawCourses = [...local, ...(rawCourses || [])];
    }
  } catch (_) {}

  // Deduplicate all collected courses
  const dedupedRaw = deduplicateCourses(rawCourses);

  // Filter only published courses and map to UI unit objects
  return dedupedRaw
    .filter((course) => {
      const status = (course.status || '').toUpperCase();
      return (
        status === 'PUBLISHED' ||
        status === 'APPROVED' ||
        status === 'UNLOCKED'
      );
    })
    .map((course) => {
      const subjectName =
        course.subject ||
        (course.subjectId ? subjectMap[course.subjectId] : null) ||
        'General';

      return {
        id: course.courseId || course.id,
        courseId: course.courseId || course.id,
        title: (course.title || course.name || 'Untitled Course').trim(),
        subject: subjectName,
        status: 'unlocked',
        image: iconForSubject(subjectName),
        thumbnailUrl: course.thumbnailUrl || course.thumbnail || null
      };
    });
};

/**
 * Deduplicate modules by moduleId AND (courseId + title) so no module appears twice in student view
 */
export const deduplicateModules = (modules = []) => {
  if (!Array.isArray(modules)) return [];
  const seenIds = new Set();
  const seenCourseTitle = new Set();
  const deduped = [];

  for (const m of modules) {
    if (!m) continue;
    const mId = Number(m.moduleId || m.id);
    const cId = Number(m.courseId || 0);
    const title = (m.title || m.name || '').trim();
    const titleKey = `${cId}_${title.toLowerCase()}`;

    if (mId && seenIds.has(String(mId))) continue;
    if (title && seenCourseTitle.has(titleKey)) continue;

    if (mId) seenIds.add(String(mId));
    if (title) seenCourseTitle.add(titleKey);

    deduped.push({
      id: mId || Date.now(),
      moduleId: mId || Date.now(),
      courseId: cId,
      title: title || `Module ${mId || 1}`,
      description: m.description || '',
      status: m.status || 'unlocked'
    });
  }

  return deduped;
};

export const fetchCourseModules = async (courseId) => {
  const cId = Number(courseId);
  let allModules = [];

  // 1. Try API Gateway or direct Course Service
  try {
    const modules = await request('/modules');
    if (Array.isArray(modules) && modules.length > 0) {
      allModules = modules.map(m => ({
        moduleId: Number(m.moduleId || m.id),
        id: Number(m.moduleId || m.id),
        courseId: Number(m.courseId),
        title: m.title || m.name,
        description: m.description || '',
        status: m.status || 'unlocked'
      }));
    }
  } catch (err) {
    console.warn('Failed to fetch modules via API:', err.message);
  }

  // 2. Merge with localStorage (created/updated by Content Creator)
  try {
    const stored = JSON.parse(localStorage.getItem('modules') || '[]');
    if (Array.isArray(stored)) {
      allModules = [...stored, ...allModules];
    }
  } catch (_) {}

  // Deduplicate by both moduleId and (courseId + title)
  const deduped = deduplicateModules(allModules);

  // Filter for this course
  const courseModules = cId ? deduped.filter((m) => Number(m.courseId) === cId) : deduped;

  // Fallback if none found
  if (courseModules.length === 0) {
    return [];
  }

  return courseModules.map((module, index) => ({
    ...module,
    image: MODULE_ICONS[index % MODULE_ICONS.length]
  }));
};

/**
 * Fetch interactive slides and learning resources for a module.
 * Merges localStorage (with creator's real-time updates) and API Gateway.
 */
const resourceBackoff = {};

export const fetchModuleSlides = async (moduleId) => {
  if (!moduleId) return [];
  const mId = Number(moduleId);

  let rawSlides = [];
  let apiList = null;

  // 1. The backend is the source of truth (gateway first, then direct service)
  const token = localStorage.getItem('access_token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const bases = import.meta.env.DEV ? ['', GATEWAY_URL, RESOURCE_SERVICE_URL] : [GATEWAY_URL, RESOURCE_SERVICE_URL];
  for (const base of bases) {
    // Skip endpoints that failed recently so the 4s polling doesn't spam errors
    if ((resourceBackoff[base] || 0) > Date.now()) continue;
    try {
      const res = await fetch(`${base}/api/resources/module/${mId}`, { headers, cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        if (Array.isArray(list)) {
          apiList = list;
          break;
        }
      }
      resourceBackoff[base] = Date.now() + 30000;
    } catch (_) {
      resourceBackoff[base] = Date.now() + 30000;
    }
  }

  if (apiList) {
    rawSlides = apiList.map((item) => ({
      ...item,
      id: item.resourceId || item.id,
      fact: item.description,
    })).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }
  
  // 2. Always merge localStorage (so recently created/updated slides show up)
  try {
    const stored = JSON.parse(
      localStorage.getItem('learning_resources') || localStorage.getItem('slides') || '[]'
    );
    if (Array.isArray(stored)) {
      const localSlides = stored.filter((s) => Number(s.moduleId) === mId);
      rawSlides = [...localSlides, ...rawSlides];
    }
  } catch (_) {}

  // Deduplicate slides by ID and (moduleId + title)
  const seenIds = new Set();
  const seenTitle = new Set();
  const normalized = [];

  for (const s of rawSlides) {
    if (!s) continue;
    const sId = s.id || s.resourceId;
    const cleanTitle = (s.title || '').trim();
    const titleKey = cleanTitle.toLowerCase();

    if (sId && seenIds.has(String(sId))) continue;
    if (cleanTitle && seenTitle.has(titleKey)) continue;

    if (sId) seenIds.add(String(sId));
    if (cleanTitle) seenTitle.add(titleKey);

    const factText = s.fact || (s.description && s.description !== s.content ? s.description : 'Remember this key concept!');
    const contentText = s.content || s.description || 'Review this educational slide to continue your learning journey.';

    normalized.push({
      id: sId || Date.now(),
      moduleId: mId,
      title: cleanTitle || 'Module Slide',
      content: contentText,
      fact: factText,
      icon: s.icon || 'twemoji:light-bulb',
      file: s.file || (s.fileUrl ? { name: cleanTitle, url: s.fileUrl } : null),
      audio: `${cleanTitle}. ${contentText} ${factText ? 'Bubbles says: ' + factText : ''}`
    });
  }

  return normalized;
};

/**
 * Fetch slide count map for modules
 */
export const fetchAllSlideCounts = async () => {
  const counts = {};

  try {
    const modules = await request("/modules");

    if (!Array.isArray(modules)) {
      return counts;
    }

    await Promise.all(
      modules.map(async (module) => {
        const moduleId = Number(module.moduleId || module.id);

        if (!moduleId) return;

        const urls = [
          `${GATEWAY_URL}/api/resources/module/${moduleId}`,
          `${RESOURCE_SERVICE_URL}/api/resources/module/${moduleId}`
        ];

        for (const url of urls) {
          try {
            const response = await fetch(url, {
              cache: "no-store"
            });

            if (!response.ok) continue;

            const json = await response.json();
            const resources = Array.isArray(json)
              ? json
              : json.data || [];

            counts[moduleId] = Array.isArray(resources)
              ? resources.length
              : 0;

            break;
          } catch {
            // Try the next configured URL
          }
        }
      })
    );
  } catch (err) {
    console.warn("Failed to fetch slide counts:", err.message);
  }

  return counts;
};



