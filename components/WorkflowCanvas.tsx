"use client";

import React, { useCallback, useRef, useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, applyNodeChanges, applyEdgeChanges, addEdge, Node, Edge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import { useBioinformaticsStore, type NodeTypeDefinition } from '@/lib/store';
import '@xyflow/react/dist/style.css';
import { BioinformaticsNode } from './BioinformaticsNode';

const nodeTypes = {
  'protein-fetch': BioinformaticsNode,
  'text-prompt': BioinformaticsNode,
  'protein-variant': BioinformaticsNode,
  'protein-prompt-processor': BioinformaticsNode,
  'protein-visualizer': BioinformaticsNode,
  'protein-molecule-dock': BioinformaticsNode,
  'protein-molecule-affinity': BioinformaticsNode,
  'molecule-fetch': BioinformaticsNode,
};

export function WorkflowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    getCurrentWorkflow,
    activeWorkflowId,
    addNode,
    addEdge: addEdgeToStore,
    updateNode,
    deleteNode,
    deleteEdge,
  } = useBioinformaticsStore();

  const currentWorkflow = getCurrentWorkflow();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (!currentWorkflow) return;
      
      changes.forEach((change) => {
        if (change.type === 'position' && change.position) {
          updateNode(activeWorkflowId, change.id, { position: change.position });
        } else if (change.type === 'remove') {
          deleteNode(activeWorkflowId, change.id);
        }
      });
    },
    [activeWorkflowId, currentWorkflow, updateNode, deleteNode]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (!currentWorkflow) return;
      
      changes.forEach((change) => {
        if (change.type === 'remove') {
          deleteEdge(activeWorkflowId, change.id);
        }
      });
    },
    [activeWorkflowId, currentWorkflow, deleteEdge]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (!currentWorkflow) return;
      
      const newEdge: Edge = {
        id: `edge-${Date.now()}`,
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
      };
      
      addEdgeToStore(activeWorkflowId, newEdge);
    },
    [activeWorkflowId, currentWorkflow, addEdgeToStore]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const data = event.dataTransfer.getData('application/reactflow');
      if (!data) return;

      try {
        const { type, nodeType } = JSON.parse(data) as {
          type: string;
          nodeType: NodeTypeDefinition;
        };

        const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        };

        const newNode: Node = {
          id: `${type}-${Date.now()}`,
          type,
          position,
          data: {
            label: nodeType.name,
            nodeType,
            inputs: nodeType.inputs.reduce((acc, input) => {
              acc[input.id] = input.required ? '' : null;
              return acc;
            }, {} as Record<string, any>),
            outputs: {},
          },
        };

        addNode(activeWorkflowId, newNode);
      } catch (error) {
        console.error('Error parsing dropped data:', error);
      }
    },
    [activeWorkflowId, addNode]
  );

  const nodes = currentWorkflow?.nodes || [];
  const edges = currentWorkflow?.edges || [];

  if (!currentWorkflow) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>No workflow selected</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
} 