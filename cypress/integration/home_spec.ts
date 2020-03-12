import labels from '../../src/labels/instantSearch.json';

describe('장르 홈 방문 테스트', () => {
  it('홈 방문이 가능', () => {
    cy.visit('/');
    cy.contains('일반');
    cy.contains('로맨스');
    cy.viewport(700, 500);
    cy.contains('일반');
    cy.contains('로맨스');
    cy.contains('판타지');
    cy.contains('BL');
    cy.contains('만화');
    cy.contains('집 앞 서점에 방금 나온 신간!');
    cy.contains('사람들이 지금 많이 읽고 있는 책');
  });

  it('로맨스 방문 가능', () => {
    cy.visit('/romance/');
    cy.contains('단행본');
    cy.contains('연재');
    cy.contains('오늘, 리디의 발견');
    cy.contains('사람들이 지금 많이 읽고 있는 책');
  });

  it('로맨스 연재 방문 가능', () => {
    cy.visit('/romance-serial/');
    cy.contains('단행본');
    cy.contains('연재');
    cy.contains('리디 기다리면 무료');
  });

  it('판타지 방문 가능', () => {
    cy.visit('/fantasy/');
    cy.contains('단행본');
    cy.contains('연재');
    cy.contains('오늘, 리디의 발견');
    cy.contains('사람들이 지금 많이 읽고 있는 책');
    cy.contains('키워드로 검색하기');

  });
  it('판타지 연재 방문 가능', () => {
    cy.visit('/fantasy-serial/');
    cy.contains('단행본');
    cy.contains('연재');
    cy.contains('특별기간 기다리면 무료');
    cy.contains('오늘, 리디의 발견');
    cy.contains('키워드로 검색하기');
  });
  it('로맨스 방문 가능', () => {
    cy.visit('/romance');
    cy.contains('단행본');
    cy.contains('연재');
  });

  it('BL 방문 가능', () => {
    cy.visit('/bl/');
    cy.contains('단행본');
    cy.contains('연재');
    cy.contains('오늘, 리디의 발견');
    cy.contains('사람들이 지금 많이 읽고 있는 책');
    cy.contains('키워드로 검색하기');
  });
  it('BL 연재 방문 가능', () => {
    cy.visit('/bl-serial/');
    cy.contains('단행본');
    cy.contains('연재');
    cy.contains('리디 기다리면 무료');
    cy.contains('사람들이 지금 많이 읽고 있는 책');
  });

  it('만화 홈 방문 가능', () => {
    cy.visit('/comics/');
    cy.contains('단행본');
    cy.contains('연재');
    cy.contains('오늘, 리디의 발견');
    cy.contains('사람들이 지금 많이 읽고 있는 책');
    cy.contains('키워드로 검색하기');

  });


  // it('검색 히스토리 목록 표시', () => {
  //   cy.clearLocalStorage();
  //   cy.get('input')
  //     .click({ multiple: true, force: true })
  //     .type('{enter}');
  //   cy.viewport(700, 500);
  //   cy.wait(250);
  //   cy.get('input')
  //     .should('have.attr', 'placeholder', labels.searchPlaceHolder)
  //     .click({ multiple: true, force: true })
  //     .type('test{enter}');
  //   cy.wait(250);
  //   cy.get('input').clear();
  //   cy.contains(labels.turnOffSearchHistory);
  //   cy.contains(labels.clearSearchHistory);
  //   cy.contains(labels.turnOffSearchHistory).click({ multiple: true, force: true });
  //   cy.contains(labels.turnOffStatus);
  //   cy.contains(labels.turnOnSearchHistory).click({ multiple: true, force: true });
  //   cy.contains(labels.clearSearchHistory).click({ multiple: true, force: true });
  // });
});

describe('홈 기능 테스트', () => {
  it('인스턴트 검색이 존재', () => {
    cy.get('input')
      .should('have.attr', 'placeholder', labels.searchPlaceHolder)
      .click({ multiple: true, force: true });

    cy.viewport(700, 500);
    cy.get('input')
      .should('have.attr', 'placeholder', labels.searchPlaceHolder)
      .click({ multiple: true, force: true });
  });
});
