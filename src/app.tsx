import React from 'react'
import { Graph } from '@antv/x6'
import { Button,Dropdown } from 'antd';

import type { MenuProps } from 'antd';

import './app.css'

const items: MenuProps['items'] = [
  {
    label: 'A',
    key: 'A',
  },
  {
    label: 'B',
    key: 'B',
  },
  {
    label: 'C',
    key: 'C',
  },
];


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
                stroke: '#00CCFF',
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


  onSave = () => {
    console.log(this.state.graph.toJSON())
    localStorage.setItem("data",JSON.stringify(this.state.graph.toJSON()))
  }

  onLoad = () => {
    console.log(localStorage.getItem('data'))
    this.state.graph.fromJSON(JSON.parse(localStorage.getItem('data')||''))
  }

  onMenuClick: MenuProps['onClick'] = ({key,domEvent}) => {
    //@ts-ignore
    console.log(`locale X is ${domEvent.clientX}, Y is ${domEvent.clientY}`);
    //@ts-ignore
    const xValue = domEvent.clientX;
    //@ts-ignore
    const yValue = domEvent.clientY;

    this.state.graph.addNode({
      label: key,
      x: xValue-20,
      y: yValue-30,
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
          fill: '#00CCFF'
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
                fillOpacity: '50%',
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
  };

  render() {

    return (
        <>
          <Dropdown menu={{ items, onClick:this.onMenuClick }} trigger={['contextMenu']}>
            <div id="container" className="app" >
              <div className="app-content" ref={this.refContainer} />
            </div>
          </Dropdown>
          <div className="button">
            <Button onClick={this.onLoad}>load</Button>
          </div>
          <div className="button">
            <Button onClick={this.onSave}>save</Button>
          </div>
        </>
    )
  }
}
