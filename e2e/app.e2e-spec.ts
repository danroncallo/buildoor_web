import { BuildoorWebPage } from './app.po';

describe('buildoor-web App', () => {
  let page: BuildoorWebPage;

  beforeEach(() => {
    page = new BuildoorWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
