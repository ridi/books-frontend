describe('Partials GNB Test', function() {
  it('GNB', () => {
    cy.visit('/partials/gnb');
    cy.contains('로그인');
    // expect(true).to.equal(true);
  });

  it('GNB 로그인 쿼리가 있을 경우', () => {
    cy.visit('/partials/gnb?is_login=true');
    cy.contains('내 서재');
    cy.contains('캐시충전');
  });

  it('event partials 에서 카테고리 네비게이션이 출현', () => {
    cy.visit('/partials/gnb?pathname=/event');
    cy.contains('일반');
    cy.contains('로맨스');
  });

  it('book detail 에서 카테고리 네비게이션이 출현', () => {
    cy.visit('/partials/gnb?pathname=/books/123456789');
    cy.contains('일반');
    cy.contains('로맨스');
  });
  it('book detail legacy (v2) 에서 카테고리 네비게이션이 출현', () => {
    cy.visit('/partials/gnb?pathname=/v2/Detail');
    cy.contains('일반');
    cy.contains('로맨스');
  });
  it('event partials 에서 카테고리 네비게이션이 출현', () => {
    cy.visit('/partials/gnb?pathname=/event/123456789');
    cy.contains('일반');
    cy.contains('로맨스');
    cy.contains('BL');
    cy.contains('만화');
  });
});
