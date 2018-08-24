// @flow strict

import { getBreakpoint } from 'lib/detect';
import { getSync as geolocationGetSync } from 'lib/geolocation';
import { commercialPrebidAdYouLike } from 'common/modules/experiments/tests/commercial-prebid-adyoulike';
import { testCanBeRun } from 'common/modules/experiments/test-can-run-checks';
import { getParticipations } from 'common/modules/experiments/utils';
import type { PrebidSize } from './types';

const stripSuffix = (s: string, suffix: string): string => {
    const re = new RegExp(`${suffix}$`);
    return s.replace(re, '');
};

const contains = (sizes: PrebidSize[], size: PrebidSize): boolean =>
    Boolean(sizes.find(s => s[0] === size[0] && s[1] === size[1]));

export const containsMpu = (sizes: PrebidSize[]): boolean =>
    contains(sizes, [300, 250]);

export const containsDmpu = (sizes: PrebidSize[]): boolean =>
    contains(sizes, [300, 600]);

export const containsLeaderboard = (sizes: PrebidSize[]): boolean =>
    contains(sizes, [728, 90]);

export const containsBillboard = (sizes: PrebidSize[]): boolean =>
    contains(sizes, [970, 250]);

export const containsMpuOrDmpu = (sizes: PrebidSize[]): boolean =>
    containsMpu(sizes) || containsDmpu(sizes);

export const containsLeaderboardOrBillboard = (sizes: PrebidSize[]): boolean =>
    containsLeaderboard(sizes) || containsBillboard(sizes);

export const getBreakpointKey = (): string => {
    switch (getBreakpoint()) {
        case 'mobile':
        case 'mobileMedium':
        case 'mobileLandscape':
        case 'phablet':
            return 'M';
        case 'tablet':
            return 'T';
        case 'desktop':
        case 'leftCol':
        case 'wide':
            return 'D';
        default:
            return 'D';
    }
};

export const shouldIncludeAppNexus = (): boolean =>
    geolocationGetSync() === 'AU';

export const shouldIncludeOpenx = (): boolean => geolocationGetSync() === 'UK';

export const shouldIncludeTrustX = (): boolean => geolocationGetSync() === 'US';

export const shouldIncludeAdYouLike = (slotSizes: PrebidSize[]): boolean => {
    const test = commercialPrebidAdYouLike;
    const participations = getParticipations();
    return (
        testCanBeRun(test) &&
        participations !== undefined &&
        participations[test.id] !== undefined &&
        participations[test.id].variant !== 'notintest' &&
        containsMpu(slotSizes)
    );
};

export const isExcludedGeolocation = (): boolean => {
    const excludedGeos = ['US', 'CA', 'NZ', 'AU'];
    return excludedGeos.includes(geolocationGetSync());
};

export const stripMobileSuffix = (s: string): string =>
    stripSuffix(s, '--mobile');

export const stripTrailingNumbersAbove1 = (s: string): string =>
    stripSuffix(s, '([2-9]|\\d{2,})');

export const getRandomIntInclusive = (
    minimum: number,
    maximum: number
): number => {
    const min = Math.ceil(minimum);
    const max = Math.floor(maximum);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
