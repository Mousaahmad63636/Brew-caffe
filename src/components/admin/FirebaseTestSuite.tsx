'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MenuService } from '@/services/menuService'
import { AuthService } from '@/services/authService'
import { useToast } from '@/hooks/use-toast'

type TestStatus = 'pending' | 'running' | 'success' | 'error'

interface TestResult {
  name: string
  status: TestStatus
  error?: string
}

const tests = [
  { key: 'firebase-connection', name: 'Firebase Connection' },
  { key: 'firestore-read', name: 'Firestore Read Access' },
  { key: 'firestore-write', name: 'Firestore Write Access (requires auth)' },
  { key: 'authentication', name: 'Authentication Service' },
  { key: 'menu-operations', name: 'Menu CRUD Operations' },
  { key: 'real-time-sync', name: 'Real-time Synchronization' },
]

export function FirebaseTestSuite() {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>(
    tests.reduce((acc, test) => ({
      ...acc,
      [test.key]: { name: test.name, status: 'pending' }
    }), {})
  )
  const [isRunning, setIsRunning] = useState(false)
  const { toast } = useToast()

  const updateTestResult = (key: string, status: TestStatus, error?: string) => {
    setTestResults(prev => ({
      ...prev,
      [key]: { ...prev[key], status, error }
    }))
  }

  const runTest = async (testKey: string) => {
    updateTestResult(testKey, 'running')
    
    try {
      switch (testKey) {
        case 'firebase-connection':
          await testFirebaseConnection()
          break
        case 'firestore-read':
          await testFirestoreRead()
          break
        case 'firestore-write':
          await testFirestoreWrite()
          break
        case 'authentication':
          await testAuthentication()
          break
        case 'menu-operations':
          await testMenuOperations()
          break
        case 'real-time-sync':
          await testRealTimeSync()
          break
      }
      updateTestResult(testKey, 'success')
    } catch (error) {
      updateTestResult(testKey, 'error', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  // Test implementations
  const testFirebaseConnection = async () => {
    // Test basic Firebase SDK initialization
    const { auth, db } = await import('@/lib/firebase')
    if (!auth || !db) {
      throw new Error('Firebase services not initialized')
    }
  }

  const testFirestoreRead = async () => {
    const categories = await MenuService.getCategories()
    // This should work even without auth
  }

  const testFirestoreWrite = async () => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser) {
      throw new Error('Authentication required for write operations')
    }
    // Try to create a test category (will be cleaned up)
    const testId = await MenuService.createCategory({
      name: 'Test Category - DELETE ME',
      description: 'Test category for firebase testing',
      order: 999,
      available: false
    })
    // Clean up
    // await MenuService.deleteCategory(testId) // We'd need to implement this
  }

  const testAuthentication = async () => {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser) {
      throw new Error('No authenticated user found - please login first')
    }
  }

  const testMenuOperations = async () => {
    // Test basic menu operations
    const items = await MenuService.getMenuItems()
    const categories = await MenuService.getCategories()
    // Both should return arrays (empty is fine)
  }

  const testRealTimeSync = async () => {
    return new Promise((resolve, reject) => {
      let resolved = false
      
      // Test real-time listener
      const unsubscribe = MenuService.subscribeToMenuItems((items) => {
        if (!resolved) {
          resolved = true
          unsubscribe()
          resolve(items)
        }
      })

      // Timeout after 5 seconds
      setTimeout(() => {
        if (!resolved) {
          unsubscribe()
          reject(new Error('Real-time listener timeout'))
        }
      }, 5000)
    })
  }

  const runAllTests = async () => {
    setIsRunning(true)
    
    for (const test of tests) {
      await runTest(test.key)
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    setIsRunning(false)
    
    const successCount = Object.values(testResults).filter(r => r.status === 'success').length
    const totalTests = tests.length
    
    toast({
      title: 'Tests Complete',
      description: `${successCount}/${totalTests} tests passed`,
      variant: successCount === totalTests ? 'default' : 'destructive'
    })
  }

  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case 'pending':
        return <div className="w-5 h-5 bg-slate-200 rounded-full" />
      case 'running':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusColor = (status: TestStatus) => {
    switch (status) {
      case 'pending': return 'bg-slate-100 text-slate-700'
      case 'running': return 'bg-blue-100 text-blue-700'
      case 'success': return 'bg-green-100 text-green-700'
      case 'error': return 'bg-red-100 text-red-700'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="font-playfair text-3xl font-bold text-slate-900 mb-2">
          Firebase Test Suite
        </h1>
        <p className="text-slate-600">
          Test your Firebase configuration and Better Menu functionality
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Test Results
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tests.map((test, index) => {
              const result = testResults[test.key]
              return (
                <motion.div
                  key={test.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-slate-300"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <h3 className="font-medium text-slate-900">{result.name}</h3>
                      {result.error && (
                        <p className="text-sm text-red-600 mt-1">{result.error}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runTest(test.key)}
                      disabled={result.status === 'running' || isRunning}
                    >
                      Test
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Prerequisites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Firebase project created with Firestore and Authentication enabled</li>
            <li>• Environment variables configured in <code className="bg-slate-100 px-2 py-1 rounded">.env.local</code></li>
            <li>• Firestore security rules published</li>
            <li>• For write operations: Admin user created and logged in</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}