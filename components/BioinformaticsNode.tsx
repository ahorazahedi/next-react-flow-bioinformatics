"use client";

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Database, 
  MessageSquare, 
  Calculator,
  Atom,
  Eye,
  Link,
  GitBranch
} from 'lucide-react';
import { NodeTypeDefinition } from '@/lib/store';

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

interface BioinformaticsNodeData {
  label: string;
  nodeType: NodeTypeDefinition;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
}

export const BioinformaticsNode = memo((props: NodeProps) => {
  const { data, selected } = props;
  const nodeData = data as unknown as BioinformaticsNodeData;
  const { label, nodeType, inputs, outputs } = nodeData;
  const IconComponent = categoryIcons[nodeType.category];

  return (
    <Card className={`w-80 ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <IconComponent className="h-4 w-4" />
            <CardTitle className="text-sm">{label}</CardTitle>
          </div>
          <Badge className={categoryColors[nodeType.category]}>
            {nodeType.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Input Handles and Fields */}
        {nodeType.inputs.map((input, index) => (
          <div key={input.id} className="relative">
            <Handle
              type="target"
              position={Position.Left}
              id={input.id}
              style={{ 
                top: `${120 + index * 40}px`,
                background: input.required ? '#ef4444' : '#6b7280',
                width: 8,
                height: 8,
              }}
            />
            <div className="ml-4">
              <Label htmlFor={`${nodeType.id}-${input.id}`} className="text-xs font-medium">
                {input.name}
                {input.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {input.type === 'string' && input.id.includes('prompt') ? (
                <Textarea
                  id={`${nodeType.id}-${input.id}`}
                  placeholder={`Enter ${input.name.toLowerCase()}...`}
                  className="mt-1 text-xs"
                  rows={3}
                  value={inputs[input.id] || ''}
                  onChange={(e) => {
                    // TODO: Update node data
                    console.log('Input changed:', input.id, e.target.value);
                  }}
                />
              ) : (
                <Input
                  id={`${nodeType.id}-${input.id}`}
                  type={input.type === 'number' ? 'number' : 'text'}
                  placeholder={`Enter ${input.name.toLowerCase()}...`}
                  className="mt-1 text-xs"
                  value={inputs[input.id] || ''}
                  onChange={(e) => {
                    // TODO: Update node data
                    console.log('Input changed:', input.id, e.target.value);
                  }}
                />
              )}
            </div>
          </div>
        ))}

        {/* Output Handles */}
        {nodeType.outputs.map((output, index) => (
          <div key={output.id} className="relative">
            <Handle
              type="source"
              position={Position.Right}
              id={output.id}
              style={{ 
                top: `${120 + index * 40}px`,
                background: '#10b981',
                width: 8,
                height: 8,
              }}
            />
            <div className="mr-4 text-right">
              <Label className="text-xs font-medium text-muted-foreground">
                {output.name}
              </Label>
              <div className="text-xs text-muted-foreground">
                {output.type}
              </div>
            </div>
          </div>
        ))}

        {/* Node Status */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
            <span className="text-xs text-muted-foreground">Ready</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {nodeType.inputs.length} inputs, {nodeType.outputs.length} outputs
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

BioinformaticsNode.displayName = 'BioinformaticsNode'; 