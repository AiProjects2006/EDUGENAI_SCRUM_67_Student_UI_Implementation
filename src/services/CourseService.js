const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8087';
const COURSE_SERVICE_URL = import.meta.env.VITE_COURSE_SERVICE_URL || 'http://localhost:8082';
const BACKOFFICE_URL = import.meta.env.VITE_BACKOFFICE_URL || 'http://localhost:8086';
const RESOURCE_SERVICE_URL = import.meta.env.VITE_RESOURCE_SERVICE_URL || 'http://localhost:8085';

const isJwtToken = (tok) => {
  return typeof tok === 'string' && tok.split('.').length === 3;
};

const request = async (path, options = {}) => {
  const method = (options.method || "GET").toUpperCase();

  const isPublicRead =
    method === "GET" &&
    ["/courses", "/subjects", "/modules"].includes(path);

  const rawToken = localStorage.getItem("access_token") || localStorage.getItem("token");
  const token = isJwtToken(rawToken) ? rawToken : null;

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
  environ: 'twemoji:deciduous-tree',
  environment: 'twemoji:deciduous-tree',
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

// Purge obsolete junk test & hardcoded mock courses
const JUNK_TEST_TITLES = [
  'test new course',
  'science explorer',
  'test course 999',
  'direct gateway',
  'primary science',
  'junior science',
  'elementary mathematics',
  'english grammar'
];

export const isJunkTestCourse = (course) => {
  if (!course) return false;
  const t = (course.title || course.name || '').trim().toLowerCase();
  return JUNK_TEST_TITLES.some((junk) => t.includes(junk));
};

export const isLegacyDefaultCourse = isJunkTestCourse;

export const isLegacyDefaultModule = (module) => {
  if (!module) return false;
  const t = (module.title || module.name || '').trim().toLowerCase();
  return JUNK_TEST_TITLES.some((junk) => t.includes(junk));
};

export const isLegacyDefaultSlide = (slide) => {
  if (!slide) return false;
  const t = (slide.title || '').trim().toLowerCase();
  return JUNK_TEST_TITLES.some((junk) => t.includes(junk));
};

// Automatically purge junk test courses from all client localStorage keys
export const purgeJunkCourses = () => {
  if (typeof window === 'undefined') return;
  const keys = ['courses', 'creator_courses', 'admin_courses', 'student_courses', 'published_courses'];
  keys.forEach((key) => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter((c) => !isJunkTestCourse(c));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem(key, JSON.stringify(cleaned));
          }
        }
      }
    } catch (_) { }
  });
};

if (typeof window !== 'undefined') {
  purgeJunkCourses();
}

/**
 * Deduplicate courses by normalized title and ID so no course appears more than once.
 */
export const deduplicateCourses = (courses = []) => {
  if (!Array.isArray(courses)) return [];
  const seenTitles = new Set();
  const seenIds = new Set();
  const result = [];

  for (const c of courses) {
    if (!c || isJunkTestCourse(c)) continue;
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
  purgeJunkCourses();
  let rawCourses = [];
  let subjects = [];

  // Attempt to fetch subjects for name resolution (never let failure block courses)
  try {
    subjects = await request('/subjects');
  } catch (_) {
    try {
      const res = await fetch(`${COURSE_SERVICE_URL}/api/v1/subjects`, { cache: 'no-store' });
      if (res.ok) {
        const body = await res.json();
        subjects = body.data || [];
      }
    } catch (_) { }
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
    console.warn('Could not fetch courses from Gateway Course Service:', err.message);
    try {
      const directRes = await fetch(`${COURSE_SERVICE_URL}/api/v1/courses`, { cache: 'no-store' });
      if (directRes.ok) {
        const directJson = await directRes.json();
        const dList = directJson.data !== undefined ? directJson.data : directJson;
        if (Array.isArray(dList) && dList.length > 0) {
          rawCourses = dList;
        }
      }
    } catch (_) { }
  }

  // 2. Secondary fallback / supplement: Backoffice API
  try {
    const backofficeUrl = `${GATEWAY_URL}/api/v1/backoffice/courses`;
    const res = await fetch(backofficeUrl, { cache: 'no-store' }).catch(() =>
      fetch(`${BACKOFFICE_URL}/api/v1/backoffice/courses`, { cache: 'no-store' })
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
  } catch (_) { }

  // 3. Supplement from localStorage (instant update when creator publishes in browser)
  try {
    const local = JSON.parse(
      localStorage.getItem('creator_courses') || localStorage.getItem('courses') || localStorage.getItem('admin_courses') || '[]'
    );
    if (Array.isArray(local) && local.length > 0) {
      rawCourses = [...local, ...(rawCourses || [])];
    }
  } catch (_) { }

  // Deduplicate all collected courses and filter out junk test courses
  const dedupedRaw = deduplicateCourses(rawCourses);

  // Filter only published/approved/unlocked courses and map to UI unit objects
  return dedupedRaw
    .filter((course) => {
      const status = (course.status || '').toUpperCase();
      return (
        !status ||
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
    if (!m || isJunkTestCourse(m)) continue;
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

export const fetchCourseModules = async (courseId, courseTitle = '') => {
  const cId = Number(courseId);
  const cleanCourseTitle = (courseTitle || '').trim().toLowerCase();
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
    console.warn('Failed to fetch modules via Gateway API:', err.message);
    try {
      const directRes = await fetch(`${COURSE_SERVICE_URL}/api/v1/modules`, { cache: 'no-store' });
      if (directRes.ok) {
        const directJson = await directRes.json();
        const dList = directJson.data !== undefined ? directJson.data : directJson;
        if (Array.isArray(dList) && dList.length > 0) {
          allModules = dList.map(m => ({
            moduleId: Number(m.moduleId || m.id),
            id: Number(m.moduleId || m.id),
            courseId: Number(m.courseId),
            title: m.title || m.name,
            description: m.description || '',
            status: m.status || 'unlocked'
          }));
        }
      }
    } catch (_) { }
  }

  // 2. Merge with localStorage (created/updated by Content Creator)
  try {
    const stored = JSON.parse(localStorage.getItem('modules') || '[]');
    if (Array.isArray(stored)) {
      allModules = [...stored, ...allModules];
    }
  } catch (_) { }

  // Deduplicate by both moduleId and (courseId + title)
  const deduped = deduplicateModules(allModules);

  // Filter for this course
  const courseModules = deduped.filter((m) => {
    if (!cId && !cleanCourseTitle) return true;
    if (cId && (Number(m.courseId) === cId || String(m.courseId) === String(courseId))) return true;
    if (cleanCourseTitle && m.courseTitle && m.courseTitle.trim().toLowerCase() === cleanCourseTitle) return true;
    return false;
  });

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

export const fetchModuleSlides = async (moduleId, moduleTitle = '', courseId = null, courseTitle = '') => {
  if (!moduleId && !moduleTitle) return [];
  const mId = Number(moduleId);
  const cleanModTitle = (moduleTitle || '').trim().toLowerCase();

  let rawSlides = [];
  let apiList = null;

  // 1. The backend is the source of truth via API Gateway
  const rawToken = localStorage.getItem('access_token');
  const headers = isJwtToken(rawToken) ? { Authorization: `Bearer ${rawToken}` } : {};
  const bases = [GATEWAY_URL, RESOURCE_SERVICE_URL];

  if (mId) {
    for (const base of bases) {
      if ((resourceBackoff[base] || 0) > Date.now()) continue;
      try {
        const res = await fetch(`${base}/api/resources/module/${mId}`, { headers, cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.data || [];
          if (Array.isArray(list) && list.length > 0) {
            apiList = list;
            break;
          }
        }
        resourceBackoff[base] = Date.now() + 10000;
      } catch (_) {
        resourceBackoff[base] = Date.now() + 10000;
      }
    }
  }

  if (apiList) {
    rawSlides = apiList.map((item) => ({
      ...item,
      id: item.resourceId || item.id,
      moduleId: mId || item.moduleId,
      fact: item.description,
    })).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  // 2. Always merge localStorage (so recently created/updated slides by Content Creator show up immediately)
  try {
    const stored = JSON.parse(
      localStorage.getItem('learning_resources') || localStorage.getItem('slides') || '[]'
    );
    if (Array.isArray(stored)) {
      const localSlides = stored.filter((s) => {
        if (mId && (Number(s.moduleId) === mId || String(s.moduleId) === String(moduleId))) return true;
        if (cleanModTitle && s.moduleTitle && s.moduleTitle.trim().toLowerCase() === cleanModTitle) return true;
        if (cleanModTitle && (s.title || '').toLowerCase().includes(cleanModTitle)) return true;
        if (courseId && Number(s.courseId) === Number(courseId) && !s.moduleId) return true;
        return false;
      });
      rawSlides = [...localSlides, ...rawSlides];
    }
  } catch (_) { }

  // Deduplicate slides by ID and (moduleId + title)
  const seenIds = new Set();
  const seenTitle = new Set();
  const normalized = [];

  for (const s of rawSlides) {
    if (!s || isLegacyDefaultSlide(s)) continue;
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
      moduleId: mId || s.moduleId,
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

let slideCountsCache = {};
let slideCountsCacheTime = 0;

/**
 * Fetch slide count map for modules safely without network flood
 */
export const fetchAllSlideCounts = async (targetModuleIds = []) => {
  const counts = {};

  // 1. Instantly count any local slides stored in browser
  try {
    const stored = JSON.parse(
      localStorage.getItem('learning_resources') || localStorage.getItem('slides') || '[]'
    );
    if (Array.isArray(stored)) {
      stored.forEach((s) => {
        const mId = Number(s.moduleId);
        if (mId) {
          counts[mId] = (counts[mId] || 0) + 1;
        }
      });
    }
  } catch (_) { }

  // 2. Return cached API counts if fresh (< 30s)
  const now = Date.now();
  if (now - slideCountsCacheTime < 30000 && Object.keys(slideCountsCache).length > 0) {
    const merged = { ...slideCountsCache };
    Object.keys(counts).forEach(k => {
      merged[k] = Math.max(merged[k] || 0, counts[k]);
    });
    return merged;
  }

  // 3. Only query API for provided module IDs
  const idsToQuery = Array.isArray(targetModuleIds) && targetModuleIds.length > 0
    ? targetModuleIds.map(Number).filter(Boolean)
    : [];

  if (idsToQuery.length > 0) {
    try {
      await Promise.all(
        idsToQuery.map(async (moduleId) => {
          try {
            const response = await fetch(`${GATEWAY_URL}/api/resources/module/${moduleId}`, {
              cache: 'no-store'
            });
            if (response.ok) {
              const json = await response.json();
              const resources = Array.isArray(json) ? json : json.data || [];
              if (Array.isArray(resources)) {
                slideCountsCache[moduleId] = resources.length;
              }
            }
          } catch (_) { }
        })
      );
      slideCountsCacheTime = now;
    } catch (_) { }
  }

  const merged = { ...slideCountsCache };
  Object.keys(counts).forEach(k => {
    merged[k] = Math.max(merged[k] || 0, counts[k]);
  });
  return merged;
};
