import "@storybook/addon-actions/register"
import "@storybook/addon-knobs/register"
import { addDecorator, addParameters } from "@storybook/react"
import { CSThemeDecorator } from "../src/view/theme/theme-decorator"

addDecorator(CSThemeDecorator)

addParameters({
  options: {
    storySort: (a, b) =>
      a[1].kind === b[1].kind
        ? 0
        : a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
  },
})
