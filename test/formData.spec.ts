import { html } from "../src/index.js"
import { getSelects, makeComplexData } from "../src/eventListener/tfFormData.js";


describe('getSelects Function', () => {
  let hostElement: HTMLElement;

  beforeEach(() => {
    hostElement = document.createElement('div');
  });

  it('should return null for no select elements', () => {
    const result = getSelects(hostElement);
    expect(result?.length).toBe(0)
  });

  it('should return an array of select values and text', () => {
    // Arrange
    const select1 = document.createElement('select');
    select1.name = 'select1';
    const option1 = document.createElement('option');
    option1.value = 'value1';
    option1.text = 'Option 1';
    select1.appendChild(option1);

    const select2 = document.createElement('select');
    select2.name = 'select2';
    const option2 = document.createElement('option');
    option2.value = 'value2';
    option2.text = 'Option 2';
    select2.appendChild(option2);

    hostElement.appendChild(select1);
    hostElement.appendChild(select2);

    const result = getSelects(hostElement);

    expect(result).toEqual([
      [
        { name: 'select1', value: 'value1' },
        { name: 'select1_text', value: 'Option 1' },
      ],
      [
        { name: 'select2', value: 'value2' },
        { name: 'select2_text', value: 'Option 2' },
      ],
    ]);
  });


  it('should option with empty value should return the text', () => {
    // this is part of the browser spec, nothing special to code.
    const select1 = document.createElement('select');
    select1.name = 'select1';
    const option1 = document.createElement('option');
    option1.text = 'Option 1';
    select1.appendChild(option1);

    const select2 = document.createElement('select');
    select2.name = 'select2';
    const option2 = document.createElement('option');
    option2.text = 'Option 2';
    select2.appendChild(option2);

    hostElement.append(select1, select2);

    const result = getSelects(hostElement);

    // Assert
    expect(result).toEqual([
      [
        { name: 'select1', value: 'Option 1' },
        { name: 'select1_text', value: 'Option 1' },
      ],
      [
        { name: 'select2', value: 'Option 2' },
        { name: 'select2_text', value: 'Option 2' },
      ],
    ]);
  });

  // Add more test cases as needed to cover different scenarios
});


describe('makeComplexData Function', () => {
  let hostElement: HTMLElement;
  beforeEach(() => {
    hostElement = document.createElement('div');
  });

 
  it('should return flat object with generic form', () => {
    hostElement.append(html`
      <input type="text" name="first" value="" />
      <input type="text" name="last" value="" />
      <textarea name="details">my text data</textarea>
      `)

    let formObject = makeComplexData(hostElement, null);

    let expected = {first: "", last: "", details: "my text data"};
    expect(expected).toEqual(formObject as any);
  });

  it('should return flat object with select in body', () => {
    hostElement.append(html`
      <input type="text" name="first" value="" />
      <input type="text" name="last" value="" />
      <select name="ageGroup">
        <option value="test0">Option A</option>
        <option selected="selected" value="test1">Option B</option>
      </select>
      `)

    let formObject = makeComplexData(hostElement, null);
    let expected = {first: "", last: "", ageGroup:"test1", ageGroup_text:"Option B"};
    expect(expected).toEqual(formObject as any);
  });

  it('should return nested object with generic form', () => {
    hostElement.append(html`
      <input type="text" name="first" value="" />
      <input type="text" name="last" value="" />
      <input type="text" name="animal.name" value="sparky" />
      <input type="text" name="my.nested.alot" value="myValue" />
      <input type="text" name="animal.legs" value="4" />
      `)

    let formObject = makeComplexData(hostElement, null);
    let expected = {first: "", last: "", animal: {name:"sparky", legs:"4"}, my: {nested: {alot: "myValue"}}};
    expect(expected).toEqual(formObject as any);
  });

  it('should return nested object inlcuding an array with generic form', () => {
    hostElement.append(html`
      <input type="text" name="first" value="" />
      <input type="text" name="last" value="" />
      <input type="text" name="animal.name" value="sparky" />
      <input type="text" name="animal.legs" value="4" />
      <input type="text" name="my.nested.alot" value="myValue" />
      <input type="text" name="food[]" value="apple" />
      <input type="text" name="food[]" value="banana" />
      `)

    let formObject = makeComplexData(hostElement, null);
    let expected = {first: "", last: "", food:["apple", "banana"], animal: {name:"sparky", legs:"4"}, my: {nested: {alot: "myValue"}}};
    expect(expected).toEqual(formObject as any);
  });

  it('should return nested object inlcuding an array in a nested objectwith generic form', () => {
    hostElement.append(html`
      <input type="text" name="first" value="" />
      <input type="text" name="last" value="" />
      <input type="text" name="animal.name" value="sparky" />
      <input type="text" name="animal.legs" value="4" />
      <input type="text" name="my.nested.alot" value="myValue" />
      <input type="text" name="my.nested.shoe[]" value="nike" />
      <input type="text" name="my.nested.shoe[]" value="adidas" />
      <input type="text" name="food[]" value="apple" />
      <input type="text" name="food[]" value="banana" />
      `)

    let formObject = makeComplexData(hostElement, null);
    let expected = {first: "", last: "", food:["apple", "banana"], animal: {name:"sparky", legs:"4"}, my: {nested: {alot: "myValue", shoe: ["nike", "adidas"]}}};
    expect(formObject as any).toEqual(expected);
  });


});