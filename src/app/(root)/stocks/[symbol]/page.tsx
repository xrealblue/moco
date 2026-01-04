import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Section */}
      <div className="border-b border-white/10 bg-black sticky top-0 z-10 backdrop-blur-sm bg-black/80">
        <div className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {symbol.toUpperCase()}
            </h1>
            <WatchlistButton 
              symbol={symbol.toUpperCase()} 
              company={symbol.toUpperCase()} 
              isInWatchlist={false} 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto p-4 md:p-6 lg:p-8">
        {/* Symbol Info - Full Width */}
        <div className="mb-6">
          <div className="bg-black border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}symbol-info.js`}
              config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
              height={170}
            />
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Charts (2/3 width) */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            {/* Candle Chart */}
            <div className="bg-black border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors">
              <div className="px-4 py-3 border-b border-white/10">
                <h2 className="text-sm font-semibold uppercase tracking-wider">
                  Advanced Chart
                </h2>
              </div>
              <TradingViewWidget
                scriptUrl={`${scriptUrl}advanced-chart.js`}
                config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
                className="custom-chart"
                height={600}
              />
            </div>

            {/* Baseline Chart */}
            <div className="bg-black border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors">
              <div className="px-4 py-3 border-b border-white/10">
                <h2 className="text-sm font-semibold uppercase tracking-wider">
                  Baseline Chart
                </h2>
              </div>
              <TradingViewWidget
                scriptUrl={`${scriptUrl}advanced-chart.js`}
                config={BASELINE_WIDGET_CONFIG(symbol)}
                className="custom-chart"
                height={600}
              />
            </div>
          </div>

          {/* Right Column - Analysis & Info (1/3 width) */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            {/* Technical Analysis */}
            <div className="bg-black border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors">
              <div className="px-4 py-3 border-b border-white/10">
                <h2 className="text-sm font-semibold uppercase tracking-wider">
                  Technical Analysis
                </h2>
              </div>
              <TradingViewWidget
                scriptUrl={`${scriptUrl}technical-analysis.js`}
                config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
                height={400}
              />
            </div>

            {/* Company Profile */}
            <div className="bg-black border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors">
              <div className="px-4 py-3 border-b border-white/10">
                <h2 className="text-sm font-semibold uppercase tracking-wider">
                  Company Profile
                </h2>
              </div>
              <TradingViewWidget
                scriptUrl={`${scriptUrl}company-profile.js`}
                config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
                height={440}
              />
            </div>

            {/* Company Financials */}
            <div className="bg-black border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors">
              <div className="px-4 py-3 border-b border-white/10">
                <h2 className="text-sm font-semibold uppercase tracking-wider">
                  Financials
                </h2>
              </div>
              <TradingViewWidget
                scriptUrl={`${scriptUrl}financials.js`}
                config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
                height={464}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}