const PROGRESS_KEY = "logicsim_progress";

interface ChallengeProgress {
    completedChallenges: string[];
    currentLevel: number;
}

export function getProgress(): ChallengeProgress {
    if (typeof window === "undefined") {
        return { completedChallenges: [], currentLevel: 1 };
    }
    const data = localStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : { completedChallenges: [], currentLevel: 1 };
}

export function saveProgress(progress: ChallengeProgress): void {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function markChallengeCompleted(challengeId: string): void {
    const progress = getProgress();
    if (!progress.completedChallenges.includes(challengeId)) {
        progress.completedChallenges.push(challengeId);
        // Increment level
        progress.currentLevel = progress.completedChallenges.length + 1;
        saveProgress(progress);
    }
}

export function isChallengeCompleted(challengeId: string): boolean {
    const progress = getProgress();
    return progress.completedChallenges.includes(challengeId);
}

export function isChallengeUnlocked(challengeId: string, requiredLevel: number): boolean {
    const progress = getProgress();
    return progress.currentLevel >= requiredLevel;
}

export function getCurrentLevel(): number {
    return getProgress().currentLevel;
}
