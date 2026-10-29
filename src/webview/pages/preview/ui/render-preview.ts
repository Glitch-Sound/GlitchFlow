/** REQ-001: initial preview content before DSL rendering is implemented. */
export function renderPreview(container: HTMLElement): void {
  const main = document.createElement("main");
  main.className = "preview";

  const heading = document.createElement("h1");
  heading.className = "preview__heading";
  heading.textContent = "GlitchFlow Preview";
  main.append(heading);

  container.replaceChildren(main);
}
