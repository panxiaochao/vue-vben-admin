export class Stack {
  get size() {
    return this.items.length;
  }
  dedup;
  items = [];
  maxSize;
  constructor(dedup = true, maxSize) {
    this.maxSize = maxSize;
    this.dedup = dedup;
  }
  clear() {
    this.items.length = 0;
  }
  peek() {
    return this.items[this.items.length - 1];
  }
  pop() {
    return this.items.pop();
  }
  push(...items) {
    items.forEach((item) => {
      if (this.dedup) {
        const index = this.items.indexOf(item);
        if (index !== -1) {
          this.items.splice(index, 1);
        }
      }
      this.items.push(item);
      if (this.maxSize && this.items.length > this.maxSize) {
        this.items.splice(0, this.items.length - this.maxSize);
      }
    });
  }
  remove(...itemList) {
    this.items = this.items.filter((i) => !itemList.includes(i));
  }
  retain(itemList) {
    this.items = this.items.filter((i) => itemList.includes(i));
  }
  toArray() {
    return [...this.items];
  }
}
export const createStack = (dedup = true, maxSize) => new Stack(dedup, maxSize);
