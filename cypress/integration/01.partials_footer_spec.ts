describe('Partials Footer Test', function() {
  it('Footer', () => {
    cy.visit('/partials/footer');
    cy.contains('사업자 정보 확인');
    cy.contains('청소년 보호 정책');
    cy.contains('사업자 정보 확인');
    cy.contains('개인 정보 처리 방침');
    cy.contains('이용 약관');
  });
});
