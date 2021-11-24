import hosts from "../utils/constants";

export default class Debug {
  strip(item) {
    return JSON.stringify({
      title: !!item.title,
      description: !!item.description,
      headline: !!item.headline,
      colored: !!item.color,
      type: item.type,
      notebooks: item.notebooks,
      tags: item.tags,
      id: item.id,
      contentId: item.contentId,
      dateEdited: item.dateEdited,
      dateDeleted: item.dateDeleted,
      dateCreated: item.dateCreated,
      additionalData: item.additionalData,
    });
  }

  async report(title, body) {
    const response = await fetch(`${hosts.ISSUES_HOST}/create/notesnook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    if (!response.ok) return;
    const json = await response.json();
    return json.url;
  }
}
