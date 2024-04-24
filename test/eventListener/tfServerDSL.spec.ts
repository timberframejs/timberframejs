import { pluginArgs } from "../../src/types.js";
import { updateCedData, attachServerRespToCedEle } from "../../src/eventListener/tfServerDSL.js";
import {} from '../../src/index.js';


describe('tfServerDSL file', () => {

  describe('updateCedData function', () => {
    let plugin : Partial<pluginArgs>
    let ele
    beforeEach(()=>{
      ele = document.createElement('div')
      plugin = {
        cedEle : ele
      } as any
    })
    
    it('throws error when there is no body or model', () => {
      expect(function(){ updateCedData({}, {}, plugin as any) } ).toThrow(new Error("Developer, you are using the tf-ced attribute without a property of body or model for component named DIV. Either add body or model to the component, or remove the post hint"));
    });
    it('merges model', () => {
      ele["model"] = {};
      updateCedData({name:"bob"}, {last:"barker", age:"21"}, plugin as any);
      expect(ele["model"]).toEqual({name:"bob", last:"barker", age:"21"})
    });
  });

  describe('attachServerRespToCedEle function', () => {
    let plugin : Partial<pluginArgs> = {};
    let ele

    const tagName = 'div';
    const qs = new URLSearchParams('param=value');
    beforeEach(()=>{
      ele = document.createElement('div')
      ele["model"] = {}
      plugin = {
        cedEle : ele,
        ele,
        tfConfig: {},
        tfMeta: {
          tfCed: {
            tagName,
            qs,
          },
        },
      } as any
    })

    it('should call serverPost when post is configured', () => {
      // @ts-ignore
      plugin.tfMeta.server = "post example.com";

      // @ts-ignore
      plugin.tfConfig.serverPost = async (x,y,z) => {
        return {name:"bob", last:"barker", age:"21"}
      };

      // @ts-ignore
      let spy1 = spyOn(plugin.tfConfig, 'serverPost');
      attachServerRespToCedEle(plugin as any);
      expect(spy1).toHaveBeenCalled();
    })

    it('should call serverGet when get is configured', () => {
      // @ts-ignore
      plugin.tfMeta.server = "get example.com";

      // @ts-ignore
      plugin.tfConfig.serverGet = async (x,y,z) => {
        return {name:"bob", last:"barker", age:"21"}
      };

      // @ts-ignore
      let spy1 = spyOn(plugin.tfConfig, 'serverGet');
      attachServerRespToCedEle(plugin as any);
      expect(spy1).toHaveBeenCalled();
    })

    it('should call serverDelete when delete is configured', () => {
      // @ts-ignore
      plugin.tfMeta.server = "delete example.com";

      // @ts-ignore
      plugin.tfConfig.serverDelete = async (x,y,z) => {
        return {name:"bob", last:"barker", age:"21"}
      };

      // @ts-ignore
      let spy1 = spyOn(plugin.tfConfig, 'serverDelete');
      attachServerRespToCedEle(plugin as any);
      expect(spy1).toHaveBeenCalled();
    })

    it('should call serverPut when put is configured', () => {
      // @ts-ignore
      plugin.tfMeta.server = "put example.com";

      // @ts-ignore
      plugin.tfConfig.serverPut = async (x,y,z) => {
        return {name:"bob", last:"barker", age:"21"}
      };

      // @ts-ignore
      let spy1 = spyOn(plugin.tfConfig, 'serverPut');
      attachServerRespToCedEle(plugin as any);
      expect(spy1).toHaveBeenCalled();
    })



  });
});
