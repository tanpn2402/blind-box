const formdata = new FormData();
formdata.append("client_id", "8256f7e49db6712");
formdata.append("client_secret", "af46c9022d77338053c51d3518c4e0b4cb470c79");
formdata.append("grant_type", "refresh_token");

function fetchJsonData<T>(url: string): Promise<{ error?: Error; data?: T }> {
  return new Promise<{
    error?: Error;
    data?: T;
  }>((resolve) => {
    fetch(url, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en",
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "omit",
    })
      .then((resp) => resp.json())
      .then((json) => resolve({ data: json }))
      .catch((error) => resolve({ error }));
  });
}

export { fetchJsonData };
