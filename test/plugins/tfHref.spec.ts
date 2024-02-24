import { tfHref } from "../../src/plugins/tfHref/tfHref.js";
import { auElementType, pluginArgs } from "../../src/types.js";

const _window = {
  location:{
    hash:''
  }
}

describe('tfHref function', () => {
  let ele
  beforeEach(()=>{
    ele = document.createElement('div')
  })
  it('should return null if tfMeta.tfHref is null', async () => {
    const plugIn = { ele };
    const result = await tfHref(plugIn, {_window});
    expect(result).toBeNull();
  });

  it('should return the expected hash value if tfMeta.tfHref is "use tf-ced"',async () => {
    const tagName = 'example-tag';
    const qs = new URLSearchParams('param=value');
    ele.setAttribute('tf-href','use tf-ced')
    const plugIn = {
      ele,
      tfMeta: {
        auCed: {
          tagName,
          qs,
        },
      },
    } as Partial<pluginArgs>;

    const result = await tfHref(plugIn, {_window});
    expect(result).toBe(`#${tagName}?${qs}`);
  });

  it('should return the expected hash value for other values of tfMeta.tfHref', async() => {
    const tfHrefValue = 'some-hash-value';
    ele.setAttribute('tf-href', tfHrefValue)
    const plugIn = { ele } as Partial<pluginArgs>;
    const result = await tfHref(plugIn, {_window});
    expect(result).toBe(`${tfHrefValue}`);
  });
});
