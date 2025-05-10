import React, { useState, useEffect } from 'react';
import { Search, Globe, Home, ChevronDown, Info, Check, Users, Baby, School, FirstAid, Gift, BookOpen } from 'lucide-react';
import { languages, translations } from '../data/translations';
import { municipalities } from '../data/municipalities';
import { supportPrograms } from '../data/supportPrograms';
import '../styles/App.css';

// カテゴリーアイコンのマッピング
const categoryIcons = {
  pregnancy: <Baby size={20} />,
  childcare: <Users size={20} />,
  medical: <FirstAid size={20} />,
  education: <School size={20} />,
  disability: <Info size={20} />,
  afterSchool: <BookOpen size={20} />
};

// メインアプリケーションコンポーネント
const TokyoChildcareSupportFinder = () => {
  const [currentLang, setCurrentLang] = useState('ja');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMunicipality, setSelectedMunicipality] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isEligibilityModalOpen, setIsEligibilityModalOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [eligibilityFilters, setEligibilityFilters] = useState({
    forForeigners: null,
    needsResidenceRegistration: null,
    needsHealthInsurance: null
  });

  // 現在の言語のテキストを取得
  const getText = (key) => {
    const langData = translations[currentLang] || translations.ja;
    
    // ドット記法でネストされたキーにアクセス
    const keys = key.split('.');
    let value = langData;
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        // キーが見つからない場合、日本語のデフォルト値を返す
        return getNestedValue(translations.ja, keys);
      }
    }
    
    return value;
  };
  
  // ネストされた値を取得するヘルパー関数
  const getNestedValue = (obj, keys) => {
    let value = obj;
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return keys[keys.length - 1]; // キーが見つからない場合、最後のキー名を返す
      }
    }
    return value;
  };

  // フィルタリングされたプログラムを取得
  const getFilteredPrograms = () => {
    return supportPrograms.filter(program => {
      const matchesSearch = searchTerm === '' || 
        program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (currentLang === 'en' && program.nameEn.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory;
      
      const matchesMunicipality = selectedMunicipality === 'all' || program.municipality === selectedMunicipality;
      
      const matchesEligibility = 
        (eligibilityFilters.forForeigners === null || program.forForeigners === eligibilityFilters.forForeigners) &&
        (eligibilityFilters.needsResidenceRegistration === null || program.needsResidenceRegistration === eligibilityFilters.needsResidenceRegistration) &&
        (eligibilityFilters.needsHealthInsurance === null || program.needsHealthInsurance === eligibilityFilters.needsHealthInsurance);
      
      return matchesSearch && matchesCategory && matchesMunicipality && matchesEligibility;
    });
  };

  // プログラム詳細を表示
  const handleViewDetails = (program) => {
    setSelectedProgram(program);
  };

  // 詳細表示から戻る
  const handleBackToList = () => {
    setSelectedProgram(null);
  };

  // 言語を切り替える
  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
    setLanguageDropdownOpen(false);
  };

  // 受給資格フィルターを更新
  const updateEligibilityFilter = (key, value) => {
    setEligibilityFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 自治体名を取得
  const getMunicipalityName = (code) => {
    const municipality = municipalities.find(m => m.code === code);
    return currentLang === 'en' ? municipality?.nameEn : municipality?.name;
  };

  // フィルタリングされたプログラムリスト
  const filteredPrograms = getFilteredPrograms();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Home size={24} className="mr-2" />
            <h1 className="text-xl font-bold">{getText('appName')}</h1>
          </div>
          
          <div className="relative">
            <button 
              className="flex items-center px-4 py-2 bg-blue-700 rounded-md"
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
            >
              <Globe size={20} className="mr-2" />
              <span>{languages.find(l => l.code === currentLang)?.flag} {languages.find(l => l.code === currentLang)?.name}</span>
              <ChevronDown size={16} className="ml-2" />
            </button>
            
            {languageDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded-md shadow-lg z-10 w-48 max-h-96 overflow-y-auto">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                    onClick={() => changeLanguage(lang.code)}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {/* タグライン */}
        <p className="text-center text-gray-600 mb-6">{getText('tagline')}</p>
        
        {selectedProgram ? (
          // プログラム詳細表示
          <div className="bg-white rounded-lg shadow-md p-6">
            <button 
              className="flex items-center text-blue-600 mb-4"
              onClick={handleBackToList}
            >
              ← {getText('back')}
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {currentLang === 'en' ? selectedProgram.nameEn : selectedProgram.name}
              </h2>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <div className="mr-4 flex items-center">
                  <Home size={16} className="mr-1" />
                  <span>{getMunicipalityName(selectedProgram.municipality)}</span>
                </div>
                <div className="flex items-center">
                  {categoryIcons[selectedProgram.category]}
                  <span className="ml-1">{getText(`categories.${selectedProgram.category}`)}</span>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                {currentLang === 'en' ? selectedProgram.descriptionEn : selectedProgram.description}
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{getText('eligibilityInfo')}</h3>
              <p className="text-gray-700 mb-4">
                {currentLang === 'en' ? selectedProgram.eligibilityEn : selectedProgram.eligibility}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${selectedProgram.forForeigners ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {selectedProgram.forForeigners ? <Check size={14} /> : '×'}
                  </div>
                  <span>{getText('supports.foreigners')}</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${selectedProgram.needsResidenceRegistration ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                    {selectedProgram.needsResidenceRegistration ? '!' : '?'}
                  </div>
                  <span>{getText('supports.needsRegistration')}</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${selectedProgram.needsHealthInsurance ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                    {selectedProgram.needsHealthInsurance ? '!' : '?'}
                  </div>
                  <span>{getText('supports.needsInsurance')}</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${selectedProgram.needsResidenceCard ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                    {selectedProgram.needsResidenceCard ? '!' : '?'}
                  </div>
                  <span>{getText('supports.documents')}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{getText('applicationProcess')}</h3>
              <p className="text-gray-700">
                {currentLang === 'en' ? selectedProgram.applicationProcessEn : selectedProgram.applicationProcess}
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{getText('requiredDocuments')}</h3>
              <p className="text-gray-700">
                {currentLang === 'en' ? selectedProgram.requiredDocumentsEn : selectedProgram.requiredDocuments}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">{getText('contactInfo')}</h3>
              <p className="text-gray-700">
                {currentLang === 'en' ? selectedProgram.contactEn : selectedProgram.contact}
              </p>
            </div>
          </div>
        ) : (
          // プログラム一覧表示
          <>
            {/* 検索バー */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder={getText('search')}
                className="w-full p-3 pl-10 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
            
            {/* フィルターセクション */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* カテゴリーフィルター */}
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h3 className="text-sm font-semibold mb-3">{getText('filterByCategory')}</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={() => setSelectedCategory('all')}
                      className="mr-2"
                    />
                    <span>{getText('all')}</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="pregnancy"
                      checked={selectedCategory === 'pregnancy'}
                      onChange={() => setSelectedCategory('pregnancy')}
                      className="mr-2"
                    />
                    <span className="flex items-center">
                      <Baby size={16} className="mr-1" />
                      {getText('pregnancy')}
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="childcare"
                      checked={selectedCategory === 'childcare'}
                      onChange={() => setSelectedCategory('childcare')}
                      className="mr-2"
                    />
                    <span className="flex items-center">
                      <Users size={16} className="mr-1" />
                      {getText('childcare')}
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="medical"
                      checked={selectedCategory === 'medical'}
                      onChange={() => setSelectedCategory('medical')}
                      className="mr-2"
                    />
                    <span className="flex items-center">
                      <FirstAid size={16} className="mr-1" />
                      {getText('medical')}
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="education"
                      checked={selectedCategory === 'education'}
                      onChange={() => setSelectedCategory('education')}
                      className="mr-2"
                    />
                    <span className="flex items-center">
                      <School size={16} className="mr-1" />
                      {getText('education')}
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="disability"
                      checked={selectedCategory === 'disability'}
                      onChange={() => setSelectedCategory('disability')}
                      className="mr-2"
                    />
                    <span className="flex items-center">
                      <Info size={16} className="mr-1" />
                      {getText('disability')}
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="afterSchool"
                      checked={selectedCategory === 'afterSchool'}
                      onChange={() => setSelectedCategory('afterSchool')}
                      className="mr-2"
                    />
                    <span className="flex items-center">
                      <BookOpen size={16} className="mr-1" />
                      {getText('afterSchool')}
                    </span>
                  </label>
                </div>
              </div>
              
              {/* 自治体フィルター */}
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h3 className="text-sm font-semibold mb-3">{getText('filterByMunicipality')}</h3>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedMunicipality}
                  onChange={(e) => setSelectedMunicipality(e.target.value)}
                >
                  <option value="all">{getText('all')}</option>
                  {municipalities.map(municipality => (
                    <option key={municipality.code} value={municipality.code}>
                      {currentLang === 'en' ? municipality.nameEn : municipality.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 受給資格フィルター */}
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h3 className="text-sm font-semibold mb-3">{getText('filterByEligibility')}</h3>
                <div className="space-y-2">
                  <div className="text-sm font-medium">{getText('supports.foreigners')}</div>
                  <div className="flex space-x-4 mb-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="forForeigners"
                        checked={eligibilityFilters.forForeigners === true}
                        onChange={() => updateEligibilityFilter('forForeigners', true)}
                        className="mr-1"
                      />
                      <span>{getText('yes')}</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="forForeigners"
                        checked={eligibilityFilters.forForeigners === false}
                        onChange={() => updateEligibilityFilter('forForeigners', false)}
                        className="mr-1"
                      />
                      <span>{getText('no')}</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="forForeigners"
                        checked={eligibilityFilters.forForeigners === null}
                        onChange={() => updateEligibilityFilter('forForeigners', null)}
                        className="mr-1"
                      />
                      <span>{getText('all')}</span>
                    </label>
                  </div>
                  
                  <div className="text-sm font-medium">{getText('supports.needsRegistration')}</div>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="needsRegistration"
                        checked={eligibilityFilters.needsResidenceRegistration === true}
                        onChange={() => updateEligibilityFilter('needsResidenceRegistration', true)}
                        className="mr-1"
                      />
                      <span>{getText('yes')}</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="needsRegistration"
                        checked={eligibilityFilters.needsResidenceRegistration === false}
                        onChange={() => updateEligibilityFilter('needsResidenceRegistration', false)}
                        className="mr-1"
                      />
                      <span>{getText('no')}</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="needsRegistration"
                        checked={eligibilityFilters.needsResidenceRegistration === null}
                        onChange={() => updateEligibilityFilter('needsResidenceRegistration', null)}
                        className="mr-1"
                      />
                      <span>{getText('all')}</span>
                    </label>
                  </div>
                  
                  <div className="text-sm font-medium mt-2">{getText('supports.needsInsurance')}</div>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="needsInsurance"
                        checked={eligibilityFilters.needsHealthInsurance === true}
                        onChange={() => updateEligibilityFilter('needsHealthInsurance', true)}
                        className="mr-1"
                      />
                      <span>{getText('yes')}</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="needsInsurance"
                        checked={eligibilityFilters.needsHealthInsurance === false}
                        onChange={() => updateEligibilityFilter('needsHealthInsurance', false)}
                        className="mr-1"
                      />
                      <span>{getText('no')}</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="needsInsurance"
                        checked={eligibilityFilters.needsHealthInsurance === null}
                        onChange={() => updateEligibilityFilter('needsHealthInsurance', null)}
                        className="mr-1"
                      />
                      <span>{getText('all')}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 検索結果 */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">{filteredPrograms.length} {getText('resultsFound')}</p>
            </div>
            
            {/* プログラムリスト */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map(program => (
                <div 
                  key={program.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        program.category === 'pregnancy' ? 'bg-pink-100 text-pink-800' :
                        program.category === 'childcare' ? 'bg-blue-100 text-blue-800' :
                        program.category === 'medical' ? 'bg-green-100 text-green-800' :
                        program.category === 'education' ? 'bg-yellow-100 text-yellow-800' :
                        program.category === 'disability' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getText(`categories.${program.category}`)}
                      </span>
                      <span className="text-xs text-gray-600">{getMunicipalityName(program.municipality)}</span>
                    </div>
                    
                    <h3 className="font-medium text-lg mb-2">
                      {currentLang === 'en' ? program.nameEn : program.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {currentLang === 'en' ? program.descriptionEn : program.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {program.forForeigners && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                          <Check size={12} className="mr-1" />
                          {getText('supports.foreigners')}
                        </span>
                      )}
                      {program.needsResidenceRegistration && (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-full">
                          <Home size={12} className="mr-1" />
                          {getText('supports.needsRegistration')}
                        </span>
                      )}
                      {program.needsHealthInsurance && (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-full">
                          <FirstAid size={12} className="mr-1" />
                          {getText('supports.needsInsurance')}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleViewDetails(program)}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                    >
                      {getText('viewDetails')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredPrograms.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">{currentLang === 'en' ? 'No results found. Please change your search criteria.' : '検索結果がありません。検索条件を変更してください。'}</p>
              </div>
            )}
            
            {/* 受給資格チェックツール - モーダル */}
            {isEligibilityModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-bold mb-4">{getText('eligibilityCheck')}</h2>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">{getText('residentStatus')}</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="radio" name="residentStatus" className="mr-2" />
                        <span>在留カード所持</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="residentStatus" className="mr-2" />
                        <span>特別永住者</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="residentStatus" className="mr-2" />
                        <span>短期滞在</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">{getText('residenceRegistration')}</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="radio" name="registration" className="mr-2" />
                        <span>{getText('yes')}</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="registration" className="mr-2" />
                        <span>{getText('no')}</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">{getText('healthInsurance')}</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="radio" name="insurance" className="mr-2" />
                        <span>国民健康保険</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="insurance" className="mr-2" />
                        <span>社会保険</span>
                      </label>
                      <label className="flex items-center">
                        <input type="radio" name="insurance" className="mr-2" />
                        <span>{getText('no')}</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">{getText('selectMunicipality')}</h3>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      {municipalities.map(municipality => (
                        <option key={municipality.code} value={municipality.code}>
                          {currentLang === 'en' ? municipality.nameEn : municipality.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex justify-between">
                    <button 
                      className="px-4 py-2 border border-gray-300 rounded-md"
                      onClick={() => setIsEligibilityModalOpen(false)}
                    >
                      {getText('back')}
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                      {getText('eligibilityCheck')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-lg font-semibold mb-2">{getText('appName')}</p>
              <p className="text-sm text-gray-300">
                {currentLang === 'en' ? 'Supporting foreign residents in Tokyo with childcare information' : '東京在住の外国人の子育てをサポートする情報サービス'}
              </p>
            </div>
            
            <div>
              <button 
                onClick={() => setIsEligibilityModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
              >
                {getText('eligibilityCheck')}
              </button>
            </div>
          </div>
          
          <hr className="my-4 border-gray-700" />
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {languages.slice(0, 5).map(lang => (
              <button 
                key={lang.code}
                className="hover:text-blue-300 transition-colors"
                onClick={() => changeLanguage(lang.code)}
              >
                {lang.flag} {lang.name}
              </button>
            ))}
            <div className="relative group">
              <button className="hover:text-blue-300 transition-colors flex items-center">
                <Globe size={16} className="mr-1" />
                {currentLang === 'en' ? 'More Languages' : 'その他の言語'}
                <ChevronDown size={14} className="ml-1" />
              </button>
              <div className="absolute bottom-full mb-2 bg-white text-gray-800 rounded-md shadow-lg z-10 w-48 hidden group-hover:block">
                {languages.slice(5).map(lang => (
                  <button
                    key={lang.code}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                    onClick={() => changeLanguage(lang.code)}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-400">
            <p>
              &copy; 2025 {getText('appName')} | 
              {currentLang === 'en' ? 'Data Source: Tokyo Metropolitan Government' : 'データ出典：東京都'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TokyoChildcareSupportFinder;
