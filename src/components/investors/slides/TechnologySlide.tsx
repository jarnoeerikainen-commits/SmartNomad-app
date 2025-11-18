import { PitchDeckSlide } from '../PitchDeckSlide';
import { Shield, Brain, Database, Lock } from 'lucide-react';

export const TechnologySlide = () => {
  return (
    <PitchDeckSlide background="bg-gradient-to-br from-blue-500/10 via-background to-purple-500/10">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Shield className="h-12 w-12 text-blue-500" />
          <h2 className="text-5xl font-bold">Technology Moats</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 space-y-3">
            <div className="flex items-center gap-3">
              <Lock className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold">Proprietary Compliance Engine</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Real-time multi-jurisdiction tax calculations</li>
              <li>• Automated visa requirement processing</li>
              <li>• Predictive policy change alerts</li>
              <li>• Military-grade document encryption</li>
            </ul>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 space-y-3">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-500" />
              <h3 className="text-2xl font-bold">AI Intelligence Layer</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 4 specialized AI models (Travel, Legal, Medical, Security)</li>
              <li>• Continuous learning from global data patterns</li>
              <li>• Location-aware personalized recommendations</li>
              <li>• Predictive risk assessment algorithms</li>
            </ul>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 space-y-3">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-green-500" />
              <h3 className="text-2xl font-bold">Data Network Effects</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Global mobility pattern database</li>
              <li>• Compliance success rate tracking</li>
              <li>• Service provider quality scoring</li>
              <li>• Threat intelligence correlation</li>
            </ul>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 space-y-3">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-500" />
              <h3 className="text-2xl font-bold">Technical Infrastructure</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 150+ modular React components</li>
              <li>• Real-time data synchronization</li>
              <li>• Offline-first mobile architecture</li>
              <li>• Enterprise-grade security protocols</li>
            </ul>
          </div>
        </div>

        <div className="bg-primary/10 rounded-xl p-6 text-center">
          <div className="text-xl font-semibold text-foreground mb-2">Defensible Technical Advantages</div>
          <div className="text-sm text-muted-foreground">
            Multiple layers of protection: Proprietary algorithms, network effects, switching costs, and strategic positioning
          </div>
        </div>
      </div>
    </PitchDeckSlide>
  );
};
