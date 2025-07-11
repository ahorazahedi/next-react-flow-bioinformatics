"use client";

import React from 'react';
import { useBioinformaticsStore, type NodeTypeDefinition } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Database, 
  MessageSquare, 
  GitBranch, 
  Shuffle, 
  Eye, 
  Link, 
  Calculator,
  Atom
} from 'lucide-react';

const categoryIcons = {
  protein: Database,
  molecule: Atom,
  analysis: Calculator,
  utility: MessageSquare,
};

const categoryColors = {
  protein: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  molecule: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  analysis: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  utility: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

interface DraggableNodeProps {
  nodeType: NodeTypeDefinition;
}

function DraggableNode({ nodeType }: DraggableNodeProps) {
  const IconComponent = categoryIcons[nodeType.category];
  
  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: nodeType.id,
      nodeType: nodeType
    }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card 
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
      draggable
      onDragStart={handleDragStart}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <IconComponent className="h-4 w-4" />
            <CardTitle className="text-sm">{nodeType.name}</CardTitle>
          </div>
          <Badge className={categoryColors[nodeType.category]}>
            {nodeType.category}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          {nodeType.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {nodeType.inputs.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Inputs:</p>
              <div className="flex flex-wrap gap-1">
                {nodeType.inputs.map((input) => (
                  <Badge 
                    key={input.id} 
                    variant="secondary" 
                    className="text-xs"
                  >
                    {input.name}
                    {input.required && <span className="text-red-500 ml-1">*</span>}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {nodeType.outputs.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Outputs:</p>
              <div className="flex flex-wrap gap-1">
                {nodeType.outputs.map((output) => (
                  <Badge 
                    key={output.id} 
                    variant="outline" 
                    className="text-xs"
                  >
                    {output.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function NodeSidebar() {
  const { nodeTypes } = useBioinformaticsStore();
  
  const groupedNodeTypes = nodeTypes.reduce((acc, nodeType) => {
    if (!acc[nodeType.category]) {
      acc[nodeType.category] = [];
    }
    acc[nodeType.category].push(nodeType);
    return acc;
  }, {} as Record<string, NodeTypeDefinition[]>);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Node Library</h2>
        <p className="text-sm text-muted-foreground">
          Drag and drop nodes to build your workflow
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {Object.entries(groupedNodeTypes).map(([category, nodes]) => (
            <div key={category}>
              <div className="flex items-center space-x-2 mb-3">
                <h3 className="text-sm font-medium capitalize">{category} Nodes</h3>
                <Badge className={categoryColors[category as keyof typeof categoryColors]}>
                  {nodes.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {nodes.map((nodeType) => (
                  <DraggableNode key={nodeType.id} nodeType={nodeType} />
                ))}
              </div>
              <Separator className="mt-4" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 