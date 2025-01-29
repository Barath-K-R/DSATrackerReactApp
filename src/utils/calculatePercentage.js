export const calculatePercentage = (typeName, groupedProblems) => {

  const problemsForType = groupedProblems[typeName] || [];
  const total = problemsForType.length;
  const completed = problemsForType.filter(problem => problem.isCompleted).length;
  if (total === 0) return 0;
  
  return (completed / total) * 100;
};