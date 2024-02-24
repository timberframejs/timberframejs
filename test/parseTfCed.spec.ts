import { defaultConfig } from "../src/defaultConfig.js";
import { parseTfCed } from "../src/eventListener/parseTfCed.js";


describe('parseTfCed', () => {
  it('should parse a raw string with verb', () => {
    const raw = 'post div?is=hello-world';
    const parsed = parseTfCed(raw, defaultConfig, undefined);
    const sp = new URLSearchParams('is=hello-world');
    expect(parsed).toEqual({
      raw,
      verb: 'post',
      tagName: 'div',
      qs: sp,
    });
  });

  it('should parse a raw string without verb', () => {
    const raw = 'div?is=hello-world';
    const sp = new URLSearchParams('is=hello-world');
    const parsed = parseTfCed(raw, defaultConfig, undefined);
    expect(parsed).toEqual({
      raw,
      verb: defaultConfig.tfCed.verb,
      tagName: 'div',
      qs: sp,
    });
  });

  it('should parse a raw string with no query string', () => {
    const raw = 'get span';
    const parsed = parseTfCed(raw, defaultConfig, undefined);
    const sp = new URLSearchParams('');
    expect(parsed).toEqual({
      raw,
      verb: 'get',
      tagName: 'span',
      qs: sp,
    });
  });
});