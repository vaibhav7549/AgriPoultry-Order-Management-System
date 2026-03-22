import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useStore } from '../lib/store';
import { Package, Truck, CheckCircle2, MoreVertical, ChevronDown, ChevronUp } from 'lucide-react';

const COLUMNS = ['New Orders', 'Processing', 'Shipped', 'Delivered'];

export default function KanbanFulfillment() {
  const { kanbanOrders, moveKanbanOrder } = useStore();
  const [expandedCards, setExpandedCards] = useState({});

  const toggleExpand = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    // Special logic for moving to Shipped
    if (destination.droppableId === 'Shipped') {
      const trackingId = prompt("Enter Vehicle Tracking ID or Driver Name:");
      if (!trackingId) return; // Cancel if no tracking info provided
      alert(`Tracking Info saved: ${trackingId}`);
    }

    moveKanbanOrder(draggableId, destination.droppableId);
  };

  const ordersByStatus = COLUMNS.reduce((acc, col) => {
    acc[col] = kanbanOrders.filter(order => order.status === col);
    return acc;
  }, {});

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Bulk Order Fulfillment</h1>
        <p className="text-slate-500 dark:text-gray-400">Drag and drop distributor orders to update fulfillment status.</p>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 scrollbar-custom">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full min-w-max items-start">
            
            {COLUMNS.map((colName) => (
              <div key={colName} className="w-80 flex flex-col h-full max-h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-700 dark:text-gray-300 flex items-center gap-2">
                    {colName === 'New Orders' && <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                    {colName === 'Processing' && <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                    {colName === 'Shipped' && <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />}
                    {colName === 'Delivered' && <span className="w-2.5 h-2.5 rounded-full bg-green-500" />}
                    {colName}
                  </h3>
                  <span className="bg-slate-200 dark:bg-gray-700 text-slate-600 dark:text-gray-400 text-xs font-bold px-2 py-1 rounded-md">
                    {ordersByStatus[colName].length}
                  </span>
                </div>

                <Droppable droppableId={colName}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 rounded-2xl p-3 bg-slate-100/50 dark:bg-gray-800/50 border-2 transition-colors overflow-y-auto scrollbar-custom ${snapshot.isDraggingOver ? 'border-primary-300 dark:border-primary-500/50 bg-primary-50 dark:bg-primary-900/10' : 'border-transparent dark:border-gray-800'}`}
                    >
                      {ordersByStatus[colName].map((order, index) => (
                        <Draggable key={order.id} draggableId={order.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`card p-4 mb-3 user-select-none !transition-none ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-primary-500 rotate-2' : ''}`}
                              style={{ ...provided.draggableProps.style }}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded">
                                  {order.id}
                                </span>
                                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-gray-200">
                                  <MoreVertical size={16} />
                                </button>
                              </div>
                              
                              <h4 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{order.distributorName}</h4>
                              <p className="text-lg font-bold text-slate-800 dark:text-gray-200 mb-3">₹{order.totalValue.toLocaleString()}</p>

                              <div className="border-t border-slate-100 dark:border-gray-700/50 pt-3 mt-3">
                                <button 
                                  onClick={() => toggleExpand(order.id)}
                                  className="w-full flex items-center justify-between text-sm text-slate-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                  <span className="flex items-center gap-2">
                                    <Package size={14} />
                                    {order.items.length} Items Included
                                  </span>
                                  {expandedCards[order.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                
                                {expandedCards[order.id] && (
                                  <div className="mt-3 space-y-2 bg-slate-50 dark:bg-gray-900/50 p-2 rounded-lg text-sm border border-slate-100 dark:border-gray-700">
                                    {order.items.map((item, idx) => (
                                      <div key={idx} className="flex justify-between text-slate-600 dark:text-gray-300">
                                        <span>{item.product}</span>
                                        <span className="font-medium">{item.qty} units</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
