export function upload(file) {
  const formData = new FormData();
  formData.append("file", file);
}
