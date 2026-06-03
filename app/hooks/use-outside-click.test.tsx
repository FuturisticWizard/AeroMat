import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { useRef } from "react";
import { useOutsideClick } from "./use-outside-click";

function Harness({ onOutside }: { onOutside: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, onOutside);
  return (
    <div>
      <div ref={ref} data-testid="inside">
        <button data-testid="child">child</button>
      </div>
      <div data-testid="outside">outside</div>
    </div>
  );
}

afterEach(() => cleanup());

describe("useOutsideClick", () => {
  it("fires when clicking outside the referenced element", () => {
    const cb = vi.fn();
    const { getByTestId } = render(<Harness onOutside={cb} />);
    fireEvent.mouseDown(getByTestId("outside"));
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("does not fire when clicking inside the element or its children", () => {
    const cb = vi.fn();
    const { getByTestId } = render(<Harness onOutside={cb} />);
    fireEvent.mouseDown(getByTestId("inside"));
    fireEvent.mouseDown(getByTestId("child"));
    expect(cb).not.toHaveBeenCalled();
  });

  it("also reacts to touchstart outside", () => {
    const cb = vi.fn();
    const { getByTestId } = render(<Harness onOutside={cb} />);
    fireEvent.touchStart(getByTestId("outside"));
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it("stops listening after unmount", () => {
    const cb = vi.fn();
    const { unmount } = render(<Harness onOutside={cb} />);
    unmount();
    fireEvent.mouseDown(document.body);
    expect(cb).not.toHaveBeenCalled();
  });
});
