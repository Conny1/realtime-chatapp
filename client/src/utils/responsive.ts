import { css } from "styled-components";
import { Styles } from "styled-components/dist/types";

export const mobileResopnsive = (props: Styles<object>) => {
  return css`
    @media only screen and (max-width: 700px) {
      ${props}
    }
  `;
};
