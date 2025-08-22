'use client'

import Link from 'next/link'
import { 
  GraduationCap, 
  Microscope, 
  FileText, 
  Users, 
  Mail, 
  Github,
  ArrowRight
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* プロダクト情報 */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Lival AI</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              科学的根拠に基づく中高生向けパーソナルAIコーチング。
              自己決定理論とBig Five性格理論による革新的な学習診断システム。
            </p>
          </div>

          {/* 診断について */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">診断について</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/diagnosis/types" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  6つの学習タイプ
                </Link>
              </li>
              <li>
                <Link href="/about/science" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Microscope className="w-4 h-4 mr-2" />
                  科学的根拠
                </Link>
              </li>
              <li>
                <Link href="/diagnosis" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  診断を始める
                </Link>
              </li>
            </ul>
          </div>

          {/* サポート・情報 */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">サポート・情報</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about/how-it-works" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  仕組みの説明
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>

          {/* 開発者情報 */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">開発者情報</h3>
            <div className="space-y-3 text-sm">
              <div className="text-gray-300">
                <p className="mb-2">研究に基づく教育AIの開発</p>
                <p className="text-xs text-gray-400">
                  心理学研究40年の蓄積を活用した
                  次世代学習支援システム
                </p>
              </div>
              <div className="flex space-x-3 mt-4">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 下部境界線とコピーライト */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2024 Lival AI. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/about/science" className="hover:text-white transition-colors flex items-center">
                <Microscope className="w-4 h-4 mr-1" />
                科学的信頼性
              </Link>
              <span className="text-gray-600">|</span>
              <span className="flex items-center text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                検証済みシステム
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}