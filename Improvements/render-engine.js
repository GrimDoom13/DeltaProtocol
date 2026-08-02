/*
 * Delta Squad — dropdown & codex renderer.
 *
 * Reads GameData (game-data.js) and builds the <li>/<button> markup that is
 * currently hand-written 2-5x per page. Load order matters:
 *
 *   <script src="game-data.js"></script>
 *   <script src="render-engine.js"></script>
 *   <script src="script.js"></script>   <!-- unchanged, existing file -->
 *
 * Each renderer produces EXACTLY the markup/attributes script.js already
 * expects (data-image / data-cost / data-info-title / data-info-content on
 * .dropdown-item, data-image / data-name / data-description on .codex-btn),
 * so script.js itself needs zero changes. Because render-engine.js's
 * DOMContentLoaded listener is registered first, it fills the dropdowns
 * before script.js's own DOMContentLoaded handler runs (the one that
 * restores localStorage selections and measures dropdown height).
 *
 * HOW TO ADOPT THIS ON AN EXISTING PAGE
 * --------------------------------------
 * Replace a hand-written list like:
 *
 *   <ul class="dropdown-list" id="dropdown_weapon1">
 *     <li class="dropdown-item" data-image="..." data-cost="2" ...> ... </li>
 *     ... (12 more copy-pasted items) ...
 *   </ul>
 *
 * with:
 *
 *   <ul class="dropdown-list" id="dropdown_weapon1" data-source="mainWeapons"></ul>
 *
 * `data-source` is a dot-path into GameData — e.g. "vests", "grenades",
 * "attachments.scope", "codex.enemies". The same source can be reused on as
 * many slots as you like (weapon1 AND weapon2 both use data-source="mainWeapons").
 *
 * For a Codex page, replace the hand-written 20+ <button class="codex-btn">
 * blocks inside .Codex_Selector with:
 *
 *   <div class="Codex_Selector" data-codex-source="codex.enemies"></div>
 *
 * See demo-invintory-fragment.html in this folder for a working example you
 * can open directly in a browser.
 */

(function () {
  function resolvePath(path) {
    return path.split(".").reduce(
      (value, key) => (value && typeof value === "object" ? value[key] : undefined),
      GameData
    );
  }

  function buildDropdownItem(item) {
    const li = document.createElement("li");
    li.className = "dropdown-item";
    li.dataset.image = item.image;
    li.dataset.cost = item.cost;
    li.dataset.infoTitle = item.name;
    li.dataset.infoContent = item.description;

    const itemCon = document.createElement("div");
    itemCon.className = "item_con";

    const pointsCon = document.createElement("div");
    pointsCon.className = "points_con";
    pointsCon.textContent = item.cost;

    const infoCon = document.createElement("div");
    infoCon.className = "info_con";
    infoCon.textContent = "i";

    const img = document.createElement("img");
    img.src = item.image;
    img.className = "img_con";
    img.alt = item.name;

    itemCon.append(pointsCon, infoCon, img);
    li.appendChild(itemCon);
    return li;
  }

  function renderDropdown(ulElement, items) {
    ulElement.innerHTML = "";
    items.forEach((item) => ulElement.appendChild(buildDropdownItem(item)));
  }

  function buildCodexButton(entry) {
    const btn = document.createElement("button");
    btn.className = "codex-btn";
    btn.dataset.image = entry.image;
    btn.dataset.name = entry.name;
    btn.dataset.description = entry.description;

    const placeholder = document.createElement("div");
    placeholder.className = "placeholder-img";

    const img = document.createElement("img");
    img.src = entry.thumb;
    img.alt = entry.name;

    placeholder.appendChild(img);
    placeholder.appendChild(document.createTextNode(" " + entry.name));
    btn.appendChild(placeholder);
    return btn;
  }

  function renderCodexGrid(containerElement, entries) {
    containerElement.innerHTML = "";
    entries.forEach((entry) => containerElement.appendChild(buildCodexButton(entry)));
  }

  function initDropdownsFromData(root) {
    (root || document).querySelectorAll(".dropdown-list[data-source]").forEach((ul) => {
      const items = resolvePath(ul.dataset.source);
      if (Array.isArray(items)) {
        renderDropdown(ul, items);
      } else {
        console.warn(`GameData source "${ul.dataset.source}" not found or not an array for`, ul);
      }
    });
  }

  function initCodexGridsFromData(root) {
    (root || document).querySelectorAll(".Codex_Selector[data-codex-source]").forEach((container) => {
      const entries = resolvePath(container.dataset.codexSource);
      if (Array.isArray(entries)) {
        renderCodexGrid(container, entries);
      } else {
        console.warn(`GameData source "${container.dataset.codexSource}" not found or not an array for`, container);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initDropdownsFromData();
    initCodexGridsFromData();
  });

  // Exposed in case a page needs to re-render after data changes at runtime.
  window.RenderEngine = { initDropdownsFromData, initCodexGridsFromData, renderDropdown, renderCodexGrid };
})();
