import TradingViewWidget from "@/components/TradingViewWidget"
import { Button } from "@/components/ui/button"
import { HEATMAP_WIDGET_CONFIG, MARKET_DATA_WIDGET_CONFIG, MARKET_OVERVIEW_WIDGET_CONFIG, TOP_STORIES_WIDGET_CONFIG } from "@/lib/constants"

const Home = () => {
  return (
    <div className="flex super flex-col w-full bg-black min-h-screen"
    style={{
      padding: "clamp(1rem, 1.5vw, 200rem)",
      gap: "clamp(1rem, 5vw, 200rem)"
    }}
    >
      <section className = "flex md:flex-row flex-col w-full gap-8 home-section">
        <div className="w-full">
          <TradingViewWidget 
            title = "Market Overview"
            scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
            config={MARKET_OVERVIEW_WIDGET_CONFIG}
            className="custom-chart"
            height={600}
          />  
        </div>
        <div className="w-full">          
          <TradingViewWidget 
            title = "Stock Heatmap"
            scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js"
            config={HEATMAP_WIDGET_CONFIG}
            height={600}
          />  
          </div>
      </section>

      <section className = "flex md:flex-row flex-col  w-full gap-8 home-section">
        <div className="w-full">
          <TradingViewWidget 
            scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-timeline.js"
            config={TOP_STORIES_WIDGET_CONFIG}
            className="custom-chart"
            height={600}
          />  
        </div>
        <div className="w-full">          
          <TradingViewWidget 
            scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js"
            config={MARKET_DATA_WIDGET_CONFIG}
            height={600}
          />  
          </div>
      </section>
    
    </div>
  )
}

export default Home
