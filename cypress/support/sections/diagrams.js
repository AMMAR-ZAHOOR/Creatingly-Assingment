export function interceptResponseCodeWait(api, responseCode) {
  return cy.wait(api).its("response.statusCode").should("eq", responseCode);
}


export function verifyShape(){
    cy.get('.geDiagramContainer svg')
        .find('rect')
        .should('exist')
        .and('be.visible')
        .first()
        .then($shape => {
            const x = parseFloat($shape.attr('x'));
            const y = parseFloat($shape.attr('y'));

            expect(x).to.be.greaterThan(0);
            expect(y).to.be.greaterThan(0);
        });
}



// shape move
export function moveShape() {
    let initialBox;

    cy.get('g[style*="cursor: move"] rect', { timeout: 100000 })
        .first()
        .then($el => {
            initialBox = $el[0].getBoundingClientRect();
        });

    cy.get('g[style*="cursor: move"] rect')
        .first()
        .then($el => {
            const rect = $el[0].getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;

            cy.wrap($el)
                .realMouseMove(startX, startY)
                .realMouseDown()
                .then(() => {
                    cy.get('body').realMouseMove(startX + 150, startY + 50, { steps: 10 }).realMouseUp();
                });
        });

    cy.wait(300);

    // Verify shape moved
    cy.get('g[style*="cursor: move"] rect')
        .first()
        .then($el => {
            const updatedBox = $el[0].getBoundingClientRect();
            const movedX = Math.abs(updatedBox.left - initialBox.left);
            const movedY = Math.abs(updatedBox.top - initialBox.top);

            expect(movedX, 'X moved').to.be.greaterThan(20);
            expect(movedY, 'Y moved').to.be.greaterThan(20);
        });

    // Verify still visible
    cy.get('g[style*="cursor: move"] rect').first().should('be.visible');
}


// Resize shape
export function resizeShape() {
    let initialBBox, initialWidth, initialHeight;

    cy.get('g[style*="cursor: move"] rect')
        .first()
        .then($rect => {
            initialBBox = $rect[0].getBoundingClientRect();
            initialWidth = parseFloat($rect.attr('width'));
            initialHeight = parseFloat($rect.attr('height'));
        });

    cy.get('g[style*="cursor: nw-resize"] image')
        .first()
        .then($handle => {
            const box = $handle[0].getBoundingClientRect();
            const startX = box.left + box.width / 2;
            const startY = box.top + box.height / 2;
            const endX = startX - 60;
            const endY = startY - 60;

            cy.wrap($handle)
                .realMouseMove(startX, startY)
                .realMouseDown()
                .then(() => {
                    cy.get('body').realMouseMove(endX, endY, { steps: 15 }).realMouseUp();
                });
        });

    cy.wait(1000);

    // Verify updated size
    cy.get('g[style*="cursor: move"] rect')
        .first()
        .then($rect => {
            const updatedBBox = $rect[0].getBoundingClientRect();
            const updatedWidth = parseFloat($rect.attr('width'));
            const updatedHeight = parseFloat($rect.attr('height'));

            const widthDiffBBox = Math.abs(updatedBBox.width - initialBBox.width);
            const heightDiffBBox = Math.abs(updatedBBox.height - initialBBox.height);

            const widthDiffAttr = Math.abs(updatedWidth - initialWidth);
            const heightDiffAttr = Math.abs(updatedHeight - initialHeight);

            expect(widthDiffBBox + widthDiffAttr, 'Width changed').to.be.greaterThan(10);
            expect(heightDiffBBox + heightDiffAttr, 'Height changed').to.be.greaterThan(10);

            cy.wrap($rect).should('be.visible');
        });
}

