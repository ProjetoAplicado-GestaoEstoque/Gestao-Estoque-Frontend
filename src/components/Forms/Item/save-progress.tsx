

"use client"

import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export type SaveStatus = "pending" | "saving" | "success" | "error"

export interface SaveProgressItem {
    index: number
    name: string
    status: SaveStatus
    error?: string
}

interface SaveProgressProps {
    items: SaveProgressItem[]
    isVisible: boolean
}

export function SaveProgress({ items, isVisible }: SaveProgressProps) {
    if (!isVisible) return null

    const completedItems = items.filter((item) => item.status === "success" || item.status === "error").length
    const totalItems = items.length
    const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

    const successCount = items.filter((item) => item.status === "success").length
    const errorCount = items.filter((item) => item.status === "error").length

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Progresso do Salvamento</span>
                    <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {successCount} Salvos
                        </Badge>
                        {errorCount > 0 && <Badge variant="destructive">{errorCount} Erros</Badge>}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>
                            Progresso: {completedItems}/{totalItems}
                        </span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {items.map((item) => (
                        <div key={item.index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                            <div className="flex items-center space-x-2">
                                {item.status === "pending" && <div className="w-4 h-4 rounded-full bg-gray-300" />}
                                {item.status === "saving" && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                                {item.status === "success" && <CheckCircle className="w-4 h-4 text-green-500" />}
                                {item.status === "error" && <XCircle className="w-4 h-4 text-red-500" />}
                                <span className="text-sm font-medium">
                                    Produto #{item.index + 1}: {item.name}
                                </span>
                            </div>
                            {item.status === "error" && item.error && (
                                <span className="text-xs text-red-500 max-w-xs truncate">{item.error}</span>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
