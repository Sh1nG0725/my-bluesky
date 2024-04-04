import { domToReact } from 'html-react-parser'

export function replace(node: any) {
  if (node.name === 'a') {
    return (
      <a {...node.attribs} rel="noreferrer" className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">
        { domToReact(node.children) }
      </a>
    )
  }
}