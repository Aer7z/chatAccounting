

// 将12:02:03更改为12-02-03格式
export const replaceDotsWithHyphens = (dateString) => {
    // 检测是否包含 '.'
    if (dateString.includes('.')) {
        // 将 '.' 替换为 '-'
        return dateString.replace(/\./g, '-');
    }
    // 如果没有 '.', 返回原字符串
    return dateString;
}