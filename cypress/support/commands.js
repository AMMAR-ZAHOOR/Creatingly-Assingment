import 'cypress-real-events';

// Custome command for visit the URL
Cypress.Commands.add('VisitApp', () => {
  cy.visit(Cypress.config('baseUrl'))

})

// Custome command for intercept
Cypress.Commands.add("runRoutes", (route) => {
  cy.intercept('GET', 'https://app.diagrams.net/resources/dia.txt').as('Diatext');
  cy.intercept('GET', 'https://app.diagrams.net/cache?alive').as('Cachealive');
  cy.intercept('GET', 'https://app.diagrams.net/notifications').as('Notification');

});

// Custome command for Drag and drop element 
Cypress.Commands.add(
  "dragElementToCenter",
  (ItemLocator,index, widgetLocator, dropAreaLocator) => {

    const dataTransfer = new DataTransfer();

    // Select element from list
    cy.get(ItemLocator)
      .eq(index)
      .scrollIntoView()
      .should("be.visible")
      .click()

    // Wait until loading SVG disappears
    cy.get("div.popup-elements div.waiting-saved-template svg", {
      timeout: 60000,
    }).should("not.exist");

    // Get draggable element center
    cy.get(widgetLocator)
      .eq(index)
      .should("be.visible")
      .then($el => {
        const elRect = $el[0].getBoundingClientRect();
        const startX = elRect.left + elRect.width / 2;
        const startY = elRect.top + elRect.height / 2;

        // Start drag
        cy.wrap($el)
          .trigger("mousedown", { which: 1, force: true })
          .trigger("dragstart", {
            dataTransfer,
            pageX: startX,
            pageY: startY,
            force: true,
          });

        // Get drop target center
        cy.get(dropAreaLocator)
          .should("be.visible")
          .then($target => {
            const targetRect = $target[0].getBoundingClientRect();
            const dropX = targetRect.left + targetRect.width / 2;
            const dropY = targetRect.top + targetRect.height / 2;

            // Drop at center
            cy.wrap($target)
              .trigger("dragover", {
                dataTransfer,
                pageX: dropX,
                pageY: dropY,
                force: true,
              })
              .trigger("drop", {
                dataTransfer,
                pageX: dropX,
                pageY: dropY,
                force: true,
              });

            cy.wrap($el).trigger("mouseup", { force: true });
          });
      });
  }
);

// Custome command for drop shape 
Cypress.Commands.add('dragShape', (selector, offset) => {
  cy.get(selector)
    .should('exist')
    .first()
    .then($g => {
      const rect = $g[0].getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;

      cy.wrap($g)
        .trigger('mousedown', { button: 0, clientX: startX, clientY: startY, force: true })
        .trigger('mousemove', { clientX: startX + offset.x, clientY: startY + offset.y, force: true })
        .trigger('mouseup', { clientX: startX + offset.x, clientY: startY + offset.y, force: true });
    });
});



// Custome command for connect arrow
Cypress.Commands.add('connectViaArrow', (sourceNode, targetHandle) => {

  // Hover source node → show arrow
  cy.get(sourceNode)
    .trigger('mouseover', { force: true })
    .trigger('mouseenter', { force: true })
    .trigger('mousemove', { force: true })

  // Click the visible connect arrow
  cy.get('img[title*="Click to connect"]')
    .filter(':visible')
    .first()
    .click({
      shiftKey: true,   // tooltip
      force: true
    })

  // click the TARGET HANDLE (blue dot)
  cy.get(targetHandle)
    .should('be.visible')
    .trigger('mouseover', { force: true })
    .trigger('mousedown', { force: true })
    .trigger('mouseup', { force: true })
})



// Custome Command to verify SVG connection
Cypress.Commands.add('verifyConnection', (
  sourceNode,
  targetNode,
  connectorSelector,
  arrowSelector,
  moveOffsets = { source: {x:0, y:0}, target: {x:0, y:0} }
) => {

  const epsilon = 0.01; // floating-point comparison

  // Verify connector exists
  cy.get(connectorSelector)
    .should('exist')
    .and('be.visible');

  // Verify arrow exists
  cy.get(arrowSelector)
    .should('exist')
    .and('be.visible');

  // Verify arrow direction
  cy.get(connectorSelector).then($path => {
    const coords = $path.attr('d').match(/[\d\.]+/g).map(Number);

    // check horizontal
    expect(coords[2]).to.be.greaterThan(coords[0] - epsilon);

    // check  vertical
    // expect(coords[3]).to.be.lessThan(coords[1] + epsilon);
  });

  // Move source node if offsets provided
  if (moveOffsets.source.x !== 0 || moveOffsets.source.y !== 0) {
    cy.get(sourceNode)
      .trigger('mousedown', { which: 1, force: true })
      .trigger('mousemove', { clientX: moveOffsets.source.x, clientY: moveOffsets.source.y, force: true })
      .trigger('mouseup', { force: true });
  }

  // Move target node if offsets provided
  if (moveOffsets.target.x !== 0 || moveOffsets.target.y !== 0) {
    cy.get(targetNode)
      .trigger('mousedown', { which: 1, force: true })
      .trigger('mousemove', { clientX: moveOffsets.target.x, clientY: moveOffsets.target.y, force: true })
      .trigger('mouseup', { force: true });
  }

  // Verify connector still exists and direction after moving
  cy.get(connectorSelector)
    .should('exist')
    .and('be.visible');

  cy.get(connectorSelector).then($path => {
    const coordsAfter = $path.attr('d').match(/[\d\.]+/g).map(Number);
    expect(coordsAfter[2]).to.be.greaterThan(coordsAfter[0] - epsilon);
  });

});



// Custom command to edit shape text
Cypress.Commands.add('editShapeText', (shapeSelector, newText, saveByEnter = true) => {

  const textEditorSelector = 'div.mxCellEditor.geContentEditable[contenteditable="true"]';

  // Double-click to open the shape
  cy.get(shapeSelector)
    .dblclick({ force: true });

  // Type the new text
  cy.get(textEditorSelector)
    .should('be.visible')
    .clear({ force: true })
    .type(newText, { force: true });

  // Save text
  if (saveByEnter) {
    cy.get(textEditorSelector).type('{enter}', { force: true });
  }

  // Verify the text is updated inside the editor
  cy.get(textEditorSelector)
    .should('contain.text', newText);

});


// Custome command for Undo and redo
Cypress.Commands.add('undoRedoMxGraph', (shapeSelector) => {

  const getX = ($el) => parseFloat($el.attr('x'));

  // Focus the REAL graph container
  cy.get('.geDiagramContainer, .mxGraphContainer')
    .first()
    .click({ force: true })
    .focus();

  // Capture initial position
  cy.get(shapeSelector).first().then($shape => {
    cy.wrap(getX($shape)).as('initialX');
  });

  // Perform REAL mxGraph move (mousedown on vertex center)
  cy.get(shapeSelector).first().then($shape => {
    const rect = $shape[0].getBoundingClientRect();

    cy.wrap($shape)
      .trigger('mousedown', {
        clientX: rect.x + rect.width / 2,
        clientY: rect.y + rect.height / 2,
        force: true
      })
      .trigger('mousemove', {
        clientX: rect.x + rect.width / 2 + 80,
        clientY: rect.y + rect.height / 2,
        force: true
      })
      .trigger('mouseup', { force: true });
  });

  // Undo (Ctrl + Z)
  cy.get('.geDiagramContainer, .mxGraphContainer')
    .first()
    .trigger('keydown', { key: 'z', ctrlKey: true, force: true });

  // Verify reverted
  cy.get('@initialX').then(initialX => {
    cy.get(shapeSelector).first().should($shape => {
      expect(getX($shape)).to.eq(initialX);
    });
  });

  // Redo (Ctrl + Y)
  cy.get('.geDiagramContainer, .mxGraphContainer')
    .first()
    .trigger('keydown', { key: 'y', ctrlKey: true, force: true });

});


// Custome command  delete button
Cypress.Commands.add('verifyDeleteButton', () => {
  cy.get('g > rect[x="1136"]').click({force: true})
  cy.get('a.geButton[title="Delete (Delete)"]')
    .should('exist')
    .and('be.visible').click()

    const rectSelector = 'g > rect[x="1226"]';

  // Right-click on the rectangle
  cy.get(rectSelector)
    .first()
    .rightclick({ force: true });

  //  Ensure context menu is visible
  cy.get('tbody')
    .should('be.visible');

  //  Click "Delete" from context menu
  cy.contains(
    'tr.mxPopupMenuItem',
    /^Delete$/
  )
    .should('be.visible')
    .click({ force: true });

  // Verify rectangle is removed from canvas
  cy.get(rectSelector).should('not.exist');


  const connectorSelector = 'path[d^="M 1196 1572"]'; // starts with this path

  // Right-click on the connector
  cy.get(connectorSelector)
    .first()
    .rightclick({ force: true });

  // Ensure context menu is visible
  cy.get('tbody')
    .should('be.visible');

  // Click "Delete" from context menu
  cy.contains('tr.mxPopupMenuItem', /^Delete$/)
    .should('be.visible')
    .click({ force: true });

  // Verify connector is removed
  cy.get(connectorSelector).should('not.exist');

})


