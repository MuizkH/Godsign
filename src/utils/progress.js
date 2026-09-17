const TOTAL_LESSONS = 5;

// Default demo progress mappings by department/account (60% to 80% for police/health/revenue/transport)
const defaultCompletedByAccount = {
  'police@godsign.gov.in': [1, 2, 3, 4],   // 80% (4 of 5)
  'police': [1, 2, 3, 4],
  'health@godsign.gov.in': [1, 2, 3],      // 60% (3 of 5)
  'health': [1, 2, 3],
  'revenue@godsign.gov.in': [1, 2, 3, 4],  // 80% (4 of 5)
  'revenue': [1, 2, 3, 4],
  'transport@godsign.gov.in': [1, 2, 3],   // 60% (3 of 5)
  'transport': [1, 2, 3],
  'admin@godsign.gov.in': [1, 2, 3, 4, 5], // 100% (5 of 5)
  'admin': [1, 2, 3, 4, 5],
  'citizen@godsign.gov.in': [1, 2],        // 40% (2 of 5)
  'citizen': [1, 2]
};

// Helper to determine the storage key scoped to the specific user account
const getUserKeyAndId = (userIdentifier) => {
  let id = userIdentifier;

  if (!id) {
    try {
      // Attempt to auto-detect active user email/id/department from Supabase auth storage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('auth-token'))) {
          const val = localStorage.getItem(key);
          if (val) {
            const parsed = JSON.parse(val);
            if (parsed?.user?.email) {
              id = parsed.user.email;
              break;
            } else if (parsed?.user?.id) {
              id = parsed.user.id;
              break;
            }
          }
        }
      }
    } catch (e) {
      // fallback error handling
    }
  }

  const sanitizedId = (id || 'police@godsign.gov.in').toString().toLowerCase().trim();
  return {
    key: `completedLessons_${sanitizedId}`,
    sanitizedId
  };
};

export const markLessonComplete = (lessonId, userIdentifier) => {
  const { key, sanitizedId } = getUserKeyAndId(userIdentifier);
  const raw = localStorage.getItem(key);
  let completed;
  if (raw !== null) {
    completed = JSON.parse(raw);
  } else {
    const defaultList = defaultCompletedByAccount[sanitizedId] || [1, 2, 3, 4];
    completed = [...defaultList];
  }

  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
  }
  localStorage.setItem(key, JSON.stringify(completed));
};

export const getProgress = (userIdentifier) => {
  const { key, sanitizedId } = getUserKeyAndId(userIdentifier);
  const raw = localStorage.getItem(key);
  let completed;

  if (raw !== null) {
    completed = JSON.parse(raw);
  } else {
    // If no custom local edits exist yet, load default account modules (e.g. 80% for police, 60% for health, etc.)
    completed = defaultCompletedByAccount[sanitizedId] || [1, 2, 3, 4];
  }

  const percentage = Math.round((completed.length / TOTAL_LESSONS) * 100);
  return {
    completedCount: completed.length,
    totalLessons: TOTAL_LESSONS,
    percentage: Math.min(percentage, 100),
    isCourseComplete: completed.length >= TOTAL_LESSONS
  };
};

export const resetProgress = (userIdentifier) => {
  const { key } = getUserKeyAndId(userIdentifier);
  localStorage.setItem(key, JSON.stringify([]));
};