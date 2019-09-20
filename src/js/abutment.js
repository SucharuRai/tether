import TetherBase from './utils';
import { updateClasses } from './utils/classes';
import { defer } from './utils/deferred';

const { getBounds } = TetherBase.Utils;

TetherBase.modules.push({
  position({ top, left }) {
    const { height, width } = this.cache('element-bounds', () => {
      return getBounds(this.element);
    });

    const targetPos = this.getTargetBounds();

    const bottom = top + height;
    const right = left + width;

    const abutted = [];
    if (top <= targetPos.bottom && bottom >= targetPos.top) {
      ['left', 'right'].forEach((side) => {
        const targetPosSide = targetPos[side];
        if (targetPosSide === left || targetPosSide === right) {
          abutted.push(side);
        }
      });
    }

    if (left <= targetPos.right && right >= targetPos.left) {
      ['top', 'bottom'].forEach((side) => {
        const targetPosSide = targetPos[side];
        if (targetPosSide === top || targetPosSide === bottom) {
          abutted.push(side);
        }
      });
    }

    const sides = ['left', 'top', 'right', 'bottom'];
    this.all.push(this.getClass('abutted'));
    sides.forEach((side) => {
      this.all.push(`${this.getClass('abutted')}-${side}`);
    });

    if (abutted.length) {
      this.add.push(this.getClass('abutted'));
    }

    abutted.forEach((side) => {
      this.add.push(`${this.getClass('abutted')}-${side}`);
    });

    defer(() => {
      if (!(this.options.addTargetClasses === false)) {
        updateClasses(this.target, this.add, this.all);
      }
      updateClasses(this.element, this.add, this.all);
    });

    return true;
  }
});
