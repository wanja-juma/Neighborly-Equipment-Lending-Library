function getLoanStatus(loan) {
  if (
    loan.status?.toLowerCase() ===
    "returned"
  ) {
    return "Returned";
  }

  if (!loan.dueDate) {
    return loan.status || "On Track";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(loan.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  if (Number.isNaN(dueDate.getTime())) {
    return loan.status || "On Track";
  }

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const daysRemaining = Math.ceil(
    (dueDate - today) / millisecondsPerDay
  );

  if (daysRemaining < 0) {
    return "Overdue";
  }

  if (daysRemaining <= 2) {
    return "Due Soon";
  }

  return "On Track";
}

export default getLoanStatus;