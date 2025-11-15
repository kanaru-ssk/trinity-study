type Template = "YYYY-MM-DD" | "YYYY/MM/DD" | "YYYY年M月";

export function formatDate(date: Date, template: Template = "YYYY-MM-DD") {
  const yyyy = date.getFullYear();
  const m = date.getMonth() + 1;
  const mm = String(m).padStart(2, "0");
  const d = date.getDate();
  const dd = String(d).padStart(2, "0");

  if (template === "YYYY年M月") {
    return `${yyyy}年${m}月`;
  }

  if (template === "YYYY/MM/DD") {
    return `${yyyy}/${mm}/${dd}`;
  }

  // YYYY-MM-DD
  return `${yyyy}-${mm}-${dd}`;
}
