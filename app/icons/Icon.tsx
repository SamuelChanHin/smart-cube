import ArrowRight from "./svg/arrow-right.svg?react";
import ArrowTop from "./svg/arrow-top.svg?react";

type Props = {
  type: "arrow-top" | "arrow-right";
};

function Icon({
  type,
  ...props
}: Props & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>{type === "arrow-top" ? <ArrowTop /> : <ArrowRight />}</div>
  );
}

export default Icon;
