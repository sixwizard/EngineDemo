import React from 'react'
import { Graph } from '@antv/x6'
import { Button } from 'antd';
import { Select } from 'antd';

import './app.css'

Graph.registerNode(
  'custom-node',
  {
    inherit: 'rect',
    width: 100,
    height: 40,
    attrs: {
      body: {
        stroke: '#8f8f8f',
        strokeWidth: 1,
        fill: '#fff',
        rx: 6,
        ry: 6,
      },
    },
  },
  true,
)
export default class Example extends React.Component<any,any> {
  constructor(props: any) {
    super(props);
    this.state = {
      graph:{},
      selectValue: "A"
    };
  }

  private container: HTMLDivElement

  componentDidMount() {

    const options = {
      allowBlank: true,
      allowMulti: true,
      allowLoop: true,
      allowNode: true,
      allowEdge: true,
      allowPort: true,
    }

    const graph = new Graph({
      container: this.container,
      background: {
        image: "/engine.jpeg",
        repeat: "no-repeat",
        size: "auto auto",
        position: "left"
      },
      connecting: {
        ...options,
        createEdge() {
          return this.createEdge({
            attrs: {
              line: {
                stroke: '#cc3300',
                strokeWidth: 1,
              },
            },
          })
        },
      }
    })


    graph.on('cell:mouseenter', ({ cell }) => {
      if (cell.isNode()) {
        cell.addTools([
          {
            name: 'boundary',
            args: {
              attrs: {
                fill: '#7c68fc',
                stroke: '#333',
                'stroke-width': 1,
                'fill-opacity': 0.2,
              },
            },
          },
          {
            name: 'button-remove',
            args: {
              x: 0,
              y: 0,
              offset: { x: 10, y: 10 },
            },
          },
        ])
      } else {
        cell.addTools(['vertices', 'segments'])
      }
    })

    graph.on('cell:mouseleave', ({ cell }) => {
      cell.removeTools()
    })

    this.setState({graph:graph});
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  handleChange = (value: string) => {
    this.setState({selectValue: value})
  }

  onAdd = () => {
    this.state.graph.addNode({
      label: this.state.selectValue,
      x: 60,
      y: 50,
      width: 100,
      height: 40,
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 0,
          fill: '#fff',
          fillOpacity: '0%',
          rx: 6,
          ry: 6,
        },
        text:{
          fill: 'red'
        }
      },
      ports: {
        groups: {
          in: {
            position: 'top',
            attrs: {
              circle: {
                magnet: true,
                stroke: '#8f8f8f',
                strokeOpacity: '0%',
                fillOpacity: '0%',
                r: 4,
              },
            },
          },
          out: {
            position: 'bottom',
            attrs: {
              circle: {
                magnet: true,
                stroke: '#8f8f8f',
                strokeOpacity: '0%',
                fillOpacity: '0%',
                r: 4,
              },
            },
          },
        },
        items: [
          {
            id: 'port1',
            group: 'in',
          },
          {
            id: 'port4',
            group: 'out',
          }
        ],
      },
    })
  }

  onSave = () => {
    console.log(this.state.graph.toJSON())
  }

  render() {
    return (
        <>
          <div id="container" className="app" >
            <div className="app-content" ref={this.refContainer} />
          </div>
          <div className="button">
            <Select
                defaultValue="A"
                style={{ width: 120 }}
                onChange={this.handleChange}
                options={[
                  {
                    value: 'A',
                    label: 'A',
                  },
                  {
                    value: 'B',
                    label: 'B',
                  },
                  {
                    value: 'C',
                    label: 'C',
                  },
                  {
                    value: 'D',
                    label: 'D',
                  },
                ]}/>
            <Button onClick={this.onAdd}>add</Button>
            <Button onClick={this.onSave}>save</Button>
          </div>
        </>
    )
  }
}
