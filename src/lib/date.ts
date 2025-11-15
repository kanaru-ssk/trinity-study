type Template = "YYYY-MM-DD" | "YYYY/MM/DD" | "YYYY年M月";

export function formatDate(date: Date, template: Template = "YYYY-MM-DD") {
  if (template === "YYYY年M月") {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}年${month}月`;
  }

  if (template === "YYYY/MM/DD") {
    return date.toLocaleDateString("ja-JP");
  }

  // default: "YYYY-MM-DD"
  return date.toISOString().split("T")[0];
}
