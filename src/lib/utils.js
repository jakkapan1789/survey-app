// utils.js
export function cn(...inputs) {
  // ลบ clsx และ twMerge ออก ใช้การรวม string ธรรมดา
  return inputs.filter(Boolean).join(" ");
}

export function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateShort(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// export function evaluateCondition(logic, answers) {
//   const { questionId, operator, value } = logic;
//   const answer = answers[questionId];

//   if (!answer) return false;

//   if (operator === "equals") {
//     if (Array.isArray(answer)) {
//       return answer.includes(value);
//     } else {
//       return answer === value;
//     }
//   } else if (operator === "contains") {
//     if (Array.isArray(answer)) {
//       return answer.some((ans) => ans.includes(value));
//     } else {
//       return answer.includes(value);
//     }
//   }

//   return false;
// }

// lib/utils.js
export function evaluateCondition(logic, answers) {
  const { questionId, operator, value } = logic;
  const answer = answers[questionId];

  if (!answer) return false;

  switch (operator) {
    case "equals":
      if (Array.isArray(answer)) {
        return answer.includes(value);
      }
      return answer === value;
    case "notEquals":
      if (Array.isArray(answer)) {
        return !answer.includes(value);
      }
      return answer !== value;
    case "contains":
      if (Array.isArray(answer)) {
        return answer.some((ans) => ans.includes(value));
      }
      return answer.includes(value);
    default:
      return false;
  }
}
