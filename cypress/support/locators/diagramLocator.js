export const diagramLocators = {
  canvas: '.geBackgroundPage',

  shapes: {
    rect: 'g > rect[x="1136"]',
    anyRect: 'g > rect',
    connector: 'g > path[stroke="#000000"]:visible',
    arrow: 'g > path[fill="#000000"]:visible',
    connectorPath: 'path[d^="M"]'
  },

  arrows: {
    east: 'g[style*="cursor: e-resize"] image',
    south: 'g[style*="cursor: s-resize"] image'
  },

  toolbar: {
    undo: 'a.geButton[title="Undo (Ctrl+Z)"]',
    redo: 'a.geButton[title="Redo (Ctrl+Y)"]',
    delete: 'a.geButton[title="Delete (Delete)"]'
  },

  contextMenu: {
    delete: 'tr.mxPopupMenuItem[title="Delete"]'
  },

  textEditor: '.mxCellEditor.geContentEditable'
};
