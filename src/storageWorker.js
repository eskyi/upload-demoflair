// Helps generateId convert a string to hex
function dec2hex(dec) {
  return dec.toString(16).padStart(2, "0");
}

// Generates a random id
function generateId(len) {
  let arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
}

// TODO: Confirm if the random ID generation works correctly

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = decodeURIComponent(url.pathname.slice(1));
    const path = generateId(20) + key;
    switch (request.method) {
      case "POST":
        await env.MY_BUCKET.put(path, request.body);
        return new Response(`Put ${path} successfully!`);
      case "GET":
        const object = await env.MY_BUCKET.get(key);

        if (object === null) {
          return new Response("Object Not Found", { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        headers.set("Content-Disposition", "attachment");
        return new Response(object.body, {
          headers,
        });
      default:
        return new Response("Method Not Allowed", {
          status: 405,
          headers: {
            Allow: "GET, POST",
          },
        });
    }
  },
};
