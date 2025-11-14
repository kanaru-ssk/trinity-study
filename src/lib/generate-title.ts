export function generateTitle() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const monthStr = `${year}年${month}月`;
  return `【${monthStr}月最新】日本版トリニティスタディ`;
}
