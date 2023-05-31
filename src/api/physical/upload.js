import request from "@/api/request";

export function upload(file) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/bphyh/upload",
    method: "post",
    data: formData,
    headers: { "Content-Type": "multipart/mixed" },
  });
}
