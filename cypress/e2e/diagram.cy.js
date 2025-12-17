const { diagramLocators } = require("../support/locators/diagramLocator");
const { interceptResponseCodeWait, verifyShapeIsDropped, dragElementToCenter, verifyShape, moveShape, resizeShape, dragShapeArrowToTarget, dragRectHorizontallyByItsWidth } = require("../support/sections/diagrams");
describe('Shape Test', () => {

  it('TC1 - Open diagrams.net', () => {
    cy.VisitApp()
    cy.wait(2000)
    cy.runRoutes('route');
    // interceptResponse'CodeWait('@Diatext',200)
    //interceptResponseCodeWait(@Cachealive', 200)
    // interceptResponseCodeWait('@Notification', 200)
    cy.dragElementToCenter(".geItem", 6,".geItem",diagramLocators.canvas);
    verifyShape()
    moveShape()
    resizeShape()
    cy.dragElementToCenter(".geItem", 7,".geItem",diagramLocators.canvas)
    cy.connectViaArrow(diagramLocators.arrows.east,diagramLocators.arrows.south)


    cy.verifyConnection(
      diagramLocators.shapes.rect,
      diagramLocators.shapes.rect,
      diagramLocators.shapes.connector,
      diagramLocators.shapes.arrow
    );

    cy.editShapeText(diagramLocators.shapes.rect,'Hello Cypress!');
    cy.undoRedoMxGraph('g > rect');

    cy.verifyDeleteButton()

  });


})
