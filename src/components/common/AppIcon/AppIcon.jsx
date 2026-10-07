import React from 'react';
import { Icon } from '@iconify/react';

export const AppIcon = ({ icon, ...props }) => {
    return <Icon icon={icon} {...props} />;
};
