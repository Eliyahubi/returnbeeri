import { useMemo } from 'react';
import { useSurveyStore } from '@/stores/surveyStore';
import { Card } from '@/components/ui/card';
import { Users, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = [
  'hsl(220, 70%, 50%)',
  'hsl(175, 60%, 45%)',
  'hsl(280, 60%, 55%)',
  'hsl(35, 90%, 55%)',
  'hsl(145, 60%, 45%)',
];

const AdminDashboard = () => {
  const { questions, getResponseCounts, getTotalResponses } = useSurveyStore();
  const totalResponses = getTotalResponses();

  const chartData = useMemo(() => {
    return questions.map((question) => {
      const counts = getResponseCounts(question.id);
      return {
        question,
        data: Object.entries(counts).map(([name, value], idx) => ({
          name,
          value,
          fill: COLORS[idx % COLORS.length],
        })),
      };
    });
  }, [questions, getResponseCounts]);

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              סקר פתיחה - מוכנות למבחנים
            </h1>
            <p className="text-muted-foreground">תוצאות בזמן אמת</p>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <Card className="px-6 py-4 flex items-center gap-3 shadow-card">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">סה"כ ענו</p>
                <p className="text-2xl font-bold text-foreground">{totalResponses}</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {chartData.map(({ question, data }, idx) => (
            <Card key={question.id} className="p-6 shadow-card animate-fade-in">
              <div className="flex items-start gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-medium text-foreground text-sm leading-relaxed">
                  {question.questionText}
                </h3>
              </div>

              <div className="h-48">
                {question.chartType === 'pie' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                        labelLine={false}
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <XAxis 
                        type="category" 
                        dataKey="name"
                        tick={{ fontSize: 10 }}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        type="number" 
                        domain={[0, 100]}
                        ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                        tick={{ fontSize: 10 }}
                        orientation="left"
                      />
                      <Tooltip />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-2 mt-4">
                {data.map((item, index) => (
                  <div key={index} className="flex items-center gap-1.5 text-xs">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-muted-foreground">
                      {item.name} ({item.value})
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
