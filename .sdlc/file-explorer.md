# Task: Graphical File Explorer

- **Slug:** file-explorer
- **Status:** implementing
- **One-line goal:** A real file explorer over a virtual filesystem of text files: folder tree, breadcrumb navigation, and drag-and-drop files onto the desktop (where they open in a text-viewer window).

## 1. Scope
- Virtual FS: folders + text files (Notes, Profile, README), sourced from existing data.
- Left **tree-view** of folders (expand/collapse), **breadcrumb** path, main pane lists folders + files.
- Files are **draggable onto the desktop**; desktop shows dropped file icons; clicking opens the file.
- Opening a file shows it in a **text-viewer** window.
- Acceptance:
  - [ ] Folder tree navigable; clicking folder shows contents.
  - [ ] Breadcrumbs reflect path and navigate on click.
  - [ ] File opens in a text-viewer window.
  - [ ] Drag a file onto desktop → a file icon appears there; clicking it opens the file.
  - [ ] Matches design system; light + dark; typecheck/lint/build pass.

## 2. Plan
- `data/files.ts`: `FsNode` tree (folders/files) + helpers (`getFile`, `findFolder`, `folderPath`). Notes from `data/notes`, profile files from `data/profile`.
- Store: `openFileId` + `openFile/clearOpenFile` (mirror browserUrl pattern); `desktopFiles:{id,x,y}[]` + `addDesktopFile/removeDesktopFile` (session-only, not persisted).
- `data/apps.ts`: new `text-viewer` app (not in dock/desktop). Register in `appRegistry`.
- `TextViewerApp`: renders `openFileId` file as a document.
- Rewrite `FinderApp`: tree + breadcrumbs + draggable file/folder grid.
- `Desktop.tsx`: native HTML5 drop zone → `addDesktopFile`; render dropped file icons (absolute at drop point) that open on click, remove on right-click.

## 3. Implementation
- `data/files.ts`: virtual FS tree + `FILE_DRAG_TYPE`, `getFile`, `findFolder`, `folderPath`.
- Store: `openFileId`/`openFile`/`clearOpenFile`; `desktopFiles`/`addDesktopFile`/`removeDesktopFile` (session).
- `data/apps.ts` + `appRegistry`: new `text-viewer` app.
- `TextViewerApp.tsx`: renders the open file (md/txt) as a document.
- `FinderApp.tsx`: rewritten as explorer — recursive folder **tree**, **breadcrumb** bar, grid/list of folders + draggable files, footer hint.
- `Desktop.tsx`: HTML5 drop zone (`onDragOver`+`onDrop` → `addDesktopFile` at drop point) + dropped-file icons (open on click, × to remove).

## 4. Testing
- typecheck + lint + `next build` (9/9 pages): pass.
- Live: explorer shows tree (Portfolio/Notes/Profile) + breadcrumb + folders + README; clicking a file opens the **Text Viewer**; a file dropped on the desktop renders a file icon, and clicking it opens the viewer. ✅
- Note: the MCP drag tool uses pointer events and can't trigger native HTML5 DnD; verified the drop pipeline via a synthetic `DragEvent` + real mouse path (standard `draggable`/`onDrop`).

## 5. Impact / Regression
- New `text-viewer` AppId handled generically by window system. `FinderApp` no longer launches apps (it browses files) — it was only opened from dock/desktop/spotlight, all unaffected. Store additions are additive; persistence schema unchanged (desktopFiles session-only). Build confirms no broken consumers. ✅

## 6. Ship
- Status: shipped ✅.
