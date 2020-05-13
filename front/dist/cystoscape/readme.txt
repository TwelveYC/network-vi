cola is physics simulation layout for Cytoscape.js. The cola layout users a force-directed physics simulation with serveral sophisticated constrains.
模拟物理layout，严格按照力引导算法layout
不要
The AVSDF layout. It organises nodes in a circle and tries to minimise edge crossings as much as possible.
//圆形布局，但是尽可能减少交叉

CiSE(Circular Spring Embedder) is an algorithm based on the traditional force-directed layout scheme with extensions to move and rotate nodes in the same cluster as a group. Further local improvements may be obtained by flipping clusters and by swapping neighboring node pairs in the same cluster, reducing the edge crossing number.
圆形弹簧模型
有点卡，得不偿失
不要
The D3 force layout. It uses a basic physics simulation (force-directed) algorithm that generates good results for small, simple graphs.
来在于D3当中的force layout
留下

dagre  DAGs和树的Dagre布局。它将图形组织成层次结构
卡


elk
This discrete layout creates good results for most graphs and it supports compound nodes
下载不下来

euler
Euler is a fast, small file-size, high-quality force-directed (physics simulation) layout.
It is good for non-compound graphs, and it has basic support for compound graphs.
可以而且很快

fcose
留下
cose的快速版本

klay
Klay is a layout that works well for most types of graphs. It gives good results for ordinary graphs,
and it handles DAGs and compound graphs very nicely.
留下


cytoscape-ngraph.forcelayout
A physics simulation layout that works particularly well on planar graphs. It is relatively fast.
舍弃 有问题

spread
布局试图使用所有的viewport空间，但是可以将其配置为生成更紧凑的结果。它最初使用CoSE算法，在扩展阶段使用Gansner和North。
留下

spready
不要





 <script src="{% static 'cystoscape/dagre/dagre.js' %}"></script>
    <script src="{% static 'cystoscape/dagre/cytoscape-dagre.js' %}"></script>

{#    cola#}
    <script src="{% static 'cystoscape/cola/cola-extension.js' %}"></script>
    <script src="{% static 'cystoscape/cola/cytoscape-cola.js' %}"></script>

{#    cise#}
    <script src="{% static 'cystoscape/cise/cose-base.js' %}"></script>
    <script src="{% static 'cystoscape/cise/cytoscape-grahpml.js' %}"></script>
    <script src="{% static 'cystoscape/cise/cytoscape-layvo.js' %}"></script>
    <script src="{% static 'cystoscape/cise/cytoscape-cise.js' %}"></script>


